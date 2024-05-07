import express from 'express';
import dotenv from 'dotenv'
import router from './routes/main.js'
import db from './db/db.js'
import path from 'path'

import cors from 'cors'

const __dirname = path.resolve() + '/src'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())
app.use(router)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.listen(process.env.APP_PORT, () => console.log(`Listening on port ${process.env.APP_PORT}`))