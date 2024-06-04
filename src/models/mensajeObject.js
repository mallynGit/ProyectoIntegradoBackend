import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  autor: { type: String, required: true, ref: "User" },
  contenido: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mensajeSchema;
