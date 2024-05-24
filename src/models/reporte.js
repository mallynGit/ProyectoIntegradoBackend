import mongoose from "mongoose";
import db from "../db/db.js";


const reporteSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    reportante: {
        type: String,
        ref: "User"
    },
    contenido: { type: String, required: true },
    reportedId: { type: String, required: true },
    tipo: {
        type: String,
        enum: ['Comentario', 'Post', 'Mascota', 'Media'],
        required: true
    },
    timestamp: { type: Date, default: Date.now }
},
    { versionKey: false }
)

export const model = db.model("Reporte", reporteSchema)
