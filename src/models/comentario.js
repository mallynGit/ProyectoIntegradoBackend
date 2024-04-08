import mongoose from "mongoose";
import db from "../db/db.js";


const comentarioSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    autor: {
        type: String,
        ref: "User"
    },
    contenido: String,
    timestamp: { type: Date, default: Date.now }
},
    { versionKey: false }
)

export const model = db.model("Comentario", comentarioSchema)
