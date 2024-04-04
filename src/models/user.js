import mongoose from "mongoose";
import db from "../db/db.js";


const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    name: String,
    email: String,
    password: String,
    nick: String,
    pets: [{ type: mongoose.SchemaTypes.UUID, ref: "Pet" }],
    role: {
        type: String,
        default: 'USER'
    },
},
    { versionKey: false }
)

export const model = db.model("User", userSchema)
