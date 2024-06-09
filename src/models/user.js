import mongoose from "mongoose";
import db from "../db/db.js";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    nick: { type: String, unique: true },
    nombre: String,
    apellidos: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pets: [{ type: String, ref: "Pet" }],
    role: {
        type: String,
        default: 'USER'
    },
    bloqueado: { type: Boolean, default: false },
},
    { versionKey: false }
)

export const model = db.model("User", userSchema)
