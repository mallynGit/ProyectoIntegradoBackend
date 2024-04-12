import mongoose from "mongoose";
import db from "../db/db.js";

const comentarioSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    usuarios: [{
        type: String,
        ref: "User"
    }],
    
},
    { versionKey: false }
)

export const model = db.model("Comentario", comentarioSchema)
