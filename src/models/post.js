import mongoose from "mongoose";
import db from "../db/db.js";


const postSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    titulo: String,
    contenido: String,
    multimedia : [String],
    autor: {
        type: String,
        ref: "User"
    },
    comentarios: [{ type: String, ref: "Comentario" }]
},
    { versionKey: false }
)

export const model = db.model("Post", postSchema)
