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

try {
    app.use(express.json())
    app.use(cors())
    app.use(router)
    app.get('/uploads/:id', async (req, res) => {
        const { id } = req.params
        const uploads = path.join(__dirname, 'uploads')
        const files = fs.readdirSync(uploads)
        const found = files.find(file => file.split('.')[0] == id)

        if (!found) {
            return res.status(404).send("Archivo no encontrado")
        }

        const filePath = path.join(uploads, found)

        // Obtiene la extensión del archivo para establecer el tipo de contenido
        const extension = path.extname(filePath)
        const contentType = `image/${extension.slice(1)}`

        // Lee el contenido del archivo
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err)
                return res.status(500).send("Error al leer el archivo")
            }

            // Establece el tipo de contenido y envía los datos de la imagen como respuesta
            res.setHeader('Content-Type', contentType)
            res.send(data)
        })
    })
    // app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
    app.listen(process.env.APP_PORT, () => console.log(`Listening on port ${process.env.APP_PORT}`))
} catch (err) {
    console.log('Crash at ' + new Date() + ' with error: ' + err)
}