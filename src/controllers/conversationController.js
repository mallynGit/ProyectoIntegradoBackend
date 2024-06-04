import { model } from "../models/conversation.js";
import mensaje from "../models/mensajeObject.js";
import { wsChannels, broadcast } from "../server/websocket.js";

export const get = async (req, res) => {
  const { id } = req.query;
  const conversacion = await model
    .find({ _id: id })
    .populate({ path: "participantes", select: "nick" });
  res.json(conversacion);
};

export const getAll = async (req, res) => {
  const conversaciones = await model
    .find({})
    .populate({ path: "participantes", select: "nick" });
  res.json(conversaciones);
};

export const updateChat = async (req, res) => {
  const { user1, user2 } = req.body;
  const conversacion = await model.findOne({ user1, user2 });
  if (!conversacion) {
    const newConversacion = await model.create({ user1, user2 });
    return res.json(newConversacion);
  }
  res.json(conversacion);
};

export const createChat = async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    const conversacion = await model.findOne({
      participantes: { $all: [user1, user2] },
    });

    if (!conversacion) {
      const newConversacion = await model.create({
        participantes: [user1, user2],
      });
      return res.json(newConversacion);
    } else {
      console.log("ya existe chat entre ", user1, " y ", user2);
    }
    res.json(conversacion);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error" });
  }
};

export const testChat = async (req, res) => {
  const { id, content, autor } = req.body;

  if (id) {
    if (wsChannels[id]) {
      broadcast(id, { id, content, autor });
    }
  }

  res.json({ id, content, autor });
};

export const addMessage = async (req, res) => {
  const { id, content, autor } = req.body;
  let contenido = content;

  const found = await model.findById({ _id: id });
  if (found) {
    const message = { contenido, autor }
    found.mensajes.push(message);
    found.save();
    res.json({ status: "ok" });
    if (wsChannels[id]) {
      broadcast(id, { id, content, autor });
    }
  } else {
    return res.status(404).send({ error: "Conversation not found" });
  }
};
