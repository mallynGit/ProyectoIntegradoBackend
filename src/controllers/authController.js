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

  res.send(signToken({ nick: user.nick, _id: user._id }));
};

export const register = async (req, res) => {
  const { nombre, apellidos, email, password, nick } = req.body;
  const userExists = await model.findOne({ $or: [{ email }, { nick }] });


  //funciona
  if (userExists) {
    return res.status(403).send({ error: "User already exists" });
  }

  const user = await model.create({
    nombre,
    apellidos,
    email,
    password: bcrypt.hashSync(password, 10),
    nick: nick ? nick : email.split("@")[0],
  });
  res.send(user);
};

export const tokenCheck = async (req, res) => {
  try {
    let reqToken = req.headers.authorization

    if (token) {
      const token = await checkToken(reqToken)
      const decoded = await decodeToken(reqToken)
      const user = await model.findOne({ _id: decoded._id })

      // const user = await model.findOne({ _id: ()._id })
      if (!token) {
        return res.status(401).send({ error: 'Invalid token' })
      } else {
        return res.status(200).send({ token, role: user.role })
      }
    }
    //no hay token??? no creo que llegue a este punto
    res.status(500).send({ error: 'error del backend' })
  } catch (err) {
    console.log('ERR - checkToken: ', err)
  }
}