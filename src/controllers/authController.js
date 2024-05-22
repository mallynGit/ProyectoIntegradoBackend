import { model } from "../models/user.js";
import { model as media } from '../models/multimedia.js'
import { model as pet } from '../models/pet.js'
import bcrypt from "bcrypt";
import { signToken, checkToken, decodeToken } from "../utils/authToken.js";
import mongoose from "mongoose";
import db from "../db/db.js";

export const login = async (req, res) => {
  const { email, password, name } = req.body;

  let user = await model.findOne({ email });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  let pfp = await media.findOne({ _id: user._id })
  console.log(pfp)

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).send({ error: "Login failed" });
  }

  delete user._doc.password


  res.send({ token: signToken({ nick: user.nick, _id: user._id }), user });
};

export const register = async (req, res) => {
  try {
    const { nombre, apellidos, email, password, nick, pets } = req.body;
    const userExists = await model.findOne({ $or: [{ email }, { nick }] });
    console.log(req.body, ' probando testeo hola?')

    let userId
    let trimmedPassword = password.replace(/\s/g, '');

    //validaciones
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regexEmail.test(email)) {
      return res.status(403).send({ error: "Email is not valid" });
    }
    const regexPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\d\s])[A-Za-z\d\W]{8,}$/
    if (!regexPass.test(trimmedPassword)) {
      return res.status(403).send({ error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
    }
    if (userExists) {
      return res.status(403).send({ error: "User already exists" });
    }

    //si hay foto perfil
    if (req.file) {
      userId = req.file.filename.split('.')[0];
      media.create({ _id: userId, tipo: req.file.filename.split('.')[1] })
    }

    if (!pets) {
      let user = await model.create({
        _id: userId ? userId : undefined,
        nombre,
        apellidos,
        email,
        password: bcrypt.hashSync(trimmedPassword, 10),
        nick: nick ? nick : email.split("@")[0],
      });

      res.send(user);
    } else {
      const session = await db.startSession();
      try {
        session.startTransaction();

        let parsedPets = JSON.parse(pets)
        console.log(req.userimage, req.pets)
        let ids = req.pets
        let mascotas = []

        for (let i = 0; i < parsedPets.length; i++) {
          delete parsedPets[i].number
          mascotas.push({ _id: ids[`pet${i + 1}`], foto_perfil: ids[`pet${i + 1}`], multimedia: [ids[`pet${i + 1}`]], ...parsedPets[i] })
        }
        let user = new model({ _id: req.userimage, nombre, apellidos, email, password, nick, pets: Object.values(ids) })

        await pet.insertMany(mascotas, { session })
        await user.save()

        await session.commitTransaction();
        session.endSession();

        res.json({ status: 'ok' })
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err)
        res.status(500).send({ error: 'Error creating user' })
      }
    }


  } catch (err) {
    console.log(err, ' - register')
  }
};

export const tokenCheck = async (req, res) => {
  try {
    let reqToken = req.headers.authorization

    if (reqToken) {

      reqToken.slice(0, 6) === 'Bearer' ? reqToken = reqToken.slice(7) : reqToken
      let check = checkToken(reqToken)

      if (!check) {
        return res.status(200).send({ token: false })
      }
      const decoded = await decodeToken(reqToken)
      const user = await model.findOne({ _id: decoded._id }, { password: 0 })

      // const user = await model.findOne({ _id: ()._id })

      return res.status(200).send({ token: check, role: user.role, user })

    } else {
      //no hay token??? no creo que llegue a este punto
      res.status(500).send({ error: 'error del backend' })
    }
  } catch (err) {
    console.log('ERR - checkToken: ', err)
  }
}