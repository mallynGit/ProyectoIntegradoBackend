import mongoose from "mongoose";
import db from "../db/db.js";


const petSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    nombre: String,
    raza: String,
    categoria: String,
    edad: Number,
    peso: Number,
    sexo: String,
    foto_perfil: { type: String },
    multimedia: [{ type: String }],
    posts: [{ type: String, ref: "Post" }],
    comentarios: [{ type: String, ref: "Comentario" }],
},
    { versionKey: false }
)

export const model = db.model("Pet", petSchema)
