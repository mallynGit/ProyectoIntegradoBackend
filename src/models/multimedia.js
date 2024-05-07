import mongoose from "mongoose";
import db from "../db/db.js";


const multimediaSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    tipo: String,
},
    { versionKey: false, collection: 'multimedia' }
)

export const model = db.model("Multimedia", multimediaSchema)
