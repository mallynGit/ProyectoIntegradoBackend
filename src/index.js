import express from 'express';
import dotenv from 'dotenv'
import router from './routes/main.js'
import db from './db/db.js'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const __dirname = path.resolve() + '/src'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())
app.use(router)
// app.get('/uploads/:id', async (req, res) => {
//     const { id } = req.params
//     console.log(path.join(__dirname, 'uploads'))
//     const files = fs.readdirSync(path.join(__dirname, 'uploads'))
//     const found = files.filter(file => file.split('.')[0] == id)[0]
//     console.log(files)
    
//     fs.readFile(found, (err, data) => {
//         if (err) {
//             console.log(err)
//             return res.send(":(")
//         }
//         res.send(data)
//     })
    
// })
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.listen(process.env.APP_PORT, () => console.log(`Listening on port ${process.env.APP_PORT}`))