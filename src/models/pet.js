import mongoose from "mongoose";
import db from "../db/db.js";


const petSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    name: String,
    raza: String,
    categoria: String,
    edad: Number,
    foto_perfil: String,
},
    { versionKey: false }
)

export const model = db.model("Pet", petSchema)
