import mongoose from "mongoose";
import db from "../db/db.js";


const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID()
    },
    nick: String,
    nombre: String,
    apellidos: String,
    email: String,
    password: { type: String },
    pets: [{ type: String, ref: "Pet" }],
    posts: [{ type: String, ref: "Posts" }],
    role: {
        type: String,
        default: 'USER'
    },
},
    { versionKey: false }
)

export const model = db.model("User", userSchema)
