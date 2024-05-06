import { model } from "../models/user.js";
import bcrypt from "bcrypt";
import { signToken, checkToken, decodeToken } from "../utils/authToken.js";

export const login = async (req, res) => {
  const { email, password, name } = req.body;

  const user = await model.findOne({ email });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).send({ error: "Login failed" });
  }

  delete user.password

  res.send({ token: signToken({ nick: user.nick, _id: user._id }), user });
};

export const register = async (req, res) => {
  const { nombre, apellidos, email, password, nick } = req.body;
  const userExists = await model.findOne({ $or: [{ email }, { nick }] });

  let trimmedPassword = password.replace(/\s/g, '');

  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regexEmail.test(email)) {
    return res.status(403).send({ error: "Email is not valid" });
  }

  const regexPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\d\s])[A-Za-z\d\W]{8,}$/
  if (!regexPass.test(trimmedPassword)) {
    return res.status(403).send({ error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
  }

  //funciona
  if (userExists) {
    return res.status(403).send({ error: "User already exists" });
  }

  const user = await model.create({
    nombre,
    apellidos,
    email,
    password: bcrypt.hashSync(trimmedPassword, 10),
    nick: nick ? nick : email.split("@")[0],
  });
  res.send(user);
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