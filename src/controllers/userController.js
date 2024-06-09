import { model } from "../models/user.js";
import { model as pet } from "../models/pet.js";
import bcrypt from "bcrypt";

export const get = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.send(await model.find({}, { password: 0 }));
  }
  const user = await model.findOne({ nick: name }, { password: 0 });

  res.json(user);
};

export const getPetsByUser = async (req, res) => {

    const {id} = req.params

    const user = await model.findOne({ _id: id }, { password: 0 }).populate({ path: "pets" })

    res.json(user.pets)

};

export const registerUser = async (req, res) => {
  const { nombre, apellidos, email, password, nick } = req.body;

  const user = await model.create({
    nombre,
    apellidos,
    email,
    password: bcrypt.hashSync(password, 10),
    nick: nick ? nick : email.split("@")[0],
  });

  res.send(user);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, email, nick } = req.body;

  console.log(req.token);
  const requestant = await model.findOne({ _id: req.token });
  let user;
  if (requestant._id != id) {
    if (requestant.role.toLowerCase() != "admin") {
      return res.status(401).send({ error: "Not authorized" });
    } else {
      user = await model.findOneAndUpdate(
        { _id: id },
        { nombre, apellidos, email, nick }
      );
    }
  } else {
    user = await model.findOneAndUpdate(
      { _id: requestant._id },
      { nombre, apellidos, email, nick },
      { new: true }
    );
  }
  // console.log(req.body)
  user = await model.findOne({ _id: user._id }, { password: 0 });
  res.send(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const user = await model.deleteOne({ _id: id }, {}, { new: true });

  res.send(user);
};

export const blockUser = async (req, res) =>{

  const { id } = req.params;

  const user = await model.findOneAndUpdate({ _id: id }, { bloqueado: true }, { new: true })

  res.send(user)
}
