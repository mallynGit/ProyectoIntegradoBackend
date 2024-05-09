import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
let db

try {
    mongoose.set('strictQuery', false);
    db = await mongoose.connect(process.env.DB_URL);
    
    console.log('DB connected at: ', process.env.DB_URL);
} catch (e) {
    console.log("error connecting to DB: ", e);
}
export default db