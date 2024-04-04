import express from 'express';
import dotenv from 'dotenv'
import router from './routes/main.js'
import {db} from './db/db.js'

const app = express()
dotenv.config()


app.use(router)

app.listen(process.env.APP_PORT, () => console.log(`Listening on port ${process.env.APP_PORT}`))