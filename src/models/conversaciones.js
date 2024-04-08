import mongoose from "mongoose";
import db from "../db/db.js";


const comentarioSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    user1: {
        type: String,
        ref: "User"
    },
    user2: {
        type: String,
        ref: "User"
    },
    mensajes: []
    
},
    { versionKey: false }
)

export const model = db.model("Comentario", comentarioSchema)
