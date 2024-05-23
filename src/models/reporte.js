import mongoose from "mongoose";
import db from "../db/db.js";


const reporteSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    autor: {
        type: String,
        ref: "User"
    },
    contenido: String,
    reportado: String,
    tipo: String,
    timestamp: { type: Date, default: Date.now }
},
    { versionKey: false }
)

export const model = db.model("Reporte", reporteSchema)
