import mongoose from 'mongoose'
import dotenv from 'dotenv'

export let db = null;
dotenv.config();

try{
    mongoose.set('strictQuery', false);
    db = mongoose.createConnection(process.env.DB_URL);
    console.log('DB connected');
}catch(e){
    console.log("error connecting to DB: ", e);
}