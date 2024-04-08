import mongoose from "mongoose";
import db from "../db/db.js";


const multimediaSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    tipo: String,
    id_padre: String,
    tipo_padre: String,
},
    { versionKey: false, collection: 'multimedia' }
)

export const model = db.model("Multimedia", multimediaSchema)
