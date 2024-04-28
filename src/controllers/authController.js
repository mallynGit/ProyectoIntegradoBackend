import { model } from "../models/user.js";
import bcrypt from "bcrypt";
import { signToken } from "../middleware/jwt.js";

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
  const { name, email, password, nick } = req.body;
  const userExists = await model.findOne({ $or: [{ email }, { nick }] });


  //funciona
  if (userExists) {
    return res.status(403).send({ error: "User already exists" });
  }

  const user = await model.create({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    nick: nick ? nick : email.split("@")[0],
  });
  res.send(user);
};
