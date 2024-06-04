import mongoose from "mongoose";
import db from "../db/db.js";
import { default as msgSchema } from "./mensajeObject.js";

const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
    },
    participantes: {
      type: [String],
      ref: "User",
      default: [],
    },
    mensajes: {
      type: [msgSchema],
      default: [],
    },
  },
  { versionKey: false }
);

export const model = db.model("Conversation", conversationSchema);
