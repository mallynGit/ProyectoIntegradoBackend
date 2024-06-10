import { model } from "../models/pet.js";
import { model as user } from "../models/user.js";
import { model as post } from "../models/post.js";
import { model as comment } from "../models/comentario.js";
import fs from "fs";

export const get = async (req, res) => {
  let pets = await model.find({}).populate(["foto_perfil"]);
  const test = await model
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "pets",
          as: "master",
        },
      },
    ])
    .unwind("$master");

  const adios = await user.populate(test, {
    path: "master",
    select: "-password -pets -posts -role -email",
  });

  const puppets = await user.find({
    pets: { $exists: true, $not: { $size: 0 } },
  });

  for (let master of puppets) {
    for (let pet of pets) {
      if (master.pets.includes(pet._id)) {
        pet.master = master;
        console.log(pet, "entra!!!!!!!!!!!");
      }
    }
  }
  console.log(adios, "test");
  res.json(adios);
};

export const getById = async (req, res) => {
  const { id } = req.params;
  console.log(id, "pprprp");

  const test = await model
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "pets",
          as: "master",
        },
      },
    ])
    .unwind("$master");

  let adios = await user.populate(test, {
    path: "master",
    select: "-password -pets -posts -role -email",
  });
  adios = await model.populate(adios, { path: "comentarios" });
  adios = await model.populate(adios, {
    path: "comentarios.autor",
    select: "nick _id",
  });
  adios = await model.populate(adios, {
    path: "comentarios.respuestas",
    select: "-respuestas",
  });
  adios = await user.populate(adios, {
    path: "comentarios.respuestas.autor",
    select: "nick _id",
  });

  adios = adios.filter((pet) => pet._id == id);

  adios.forEach((pet) => {
    pet.comentarios.forEach((comentario) => {
      comentario.respuestas.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    });
  });

  res.json(adios);
};

export const create = async (req, res) => {
  const { nombre, raza, categoria, edad, userId, sexo, peso } = req.body;
  let pet, multimedia;
  try {
    if (req.file) {
      console.log(req.file);
    }
    let petMaster = await user.findById({ _id: userId });
    pet = await model.create({
      nombre,
      raza,
      categoria,
      edad,
      sexo,
      peso,
      foto_perfil: req.file ? req.file.filename.split(".")[0] : null,
    });
    if (petMaster.pets.includes(pet._id)) {
      petMaster.pets.splice(petMaster.pets.indexOf(pet._id), 1);
      return res.status(500).send({ error: "Error creating pet" });
    } else {
      petMaster.pets.push(pet._id);
      petMaster.save();
    }
    pet.multimedia.push(req.file.filename.split(".")[0]);
    pet.save();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Error creating pet" });
  }
  res.json(pet);
};

export const update = async (req, res) => {
  const { nombre, raza, categoria, edad, _id, sexo, peso } = req.body;
  let foto_perfil;
  try {
    if (req.file) {
      if (req.file.update) {
        let pet = await model.findById({ _id });
        foto_perfil = req.file.filename.split(".")[0];
        pet.multimedia.push(foto_perfil);
        pet.save();
      }
    }

    model
      .findByIdAndUpdate(
        { _id },
        { nombre, raza, sexo, peso, categoria, edad, foto_perfil },
        { new: true }
      )
      .then((updated) => {
        res.json(updated);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ error: "Error updating pet" });
      });
  } catch (err) {
    console.error(err);
  }
  // res.json(updatedPet)
};

export const deletePet = async (req, res) => {
  try {
    const { id } = req.query;

    const deletedPet = await model.findByIdAndDelete({ _id: id });
    for (let posts of deletedPet.posts) {
      await post.deleteOne({ _id: posts._id });
    }
    for(let comments of deletedPet.comentarios){
      await comment.deleteOne({ _id: comments._id });
    }

    console.log(deletedPet);
    for (let multimedia of deletedPet.multimedia) {
      await media.deleteOne({ _id: multimedia._id });
      // fs.unlinkSync('./src/uploads/' + multimedia._id + '.' + multimedia.tipo)
    }

    if (deletedPet == null) {
      return res.status(404).send({ error: "Pet not found" });
    }

    res.json({ msg: "succesfully deleted", deletedPet });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};

export const addMedia = async (req, res) => {
  const { petId } = req.body;
  const mediaId = req.file.filename.split(".")[0];
  const pet = await model.findById({ _id: petId });
  pet.multimedia.push(mediaId);
  pet.save();
  res.json(pet);
};
