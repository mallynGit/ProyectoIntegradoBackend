import { model } from '../models/conversaciones.js'
import mensaje from '../models/mensajeObject.js'

export const get = async (req, res) => {

    const { id } = req.query
    const conversacion = await model.find({ _id: id }).populate({ path: 'usuarios', select: 'nick' })
    res.json(conversacion)

}

export const getAll = async (req, res) => {

    const conversaciones = await model.find({}).populate({ path: 'usuarios', select: 'nick' })
    res.json(conversaciones)

}

export const updateChat = async (req, res) => {
    
    const { user1, user2 } = req.body
    const conversacion = await model.findOne({ user1, user2 })
    if(!conversacion){
        const newConversacion = await model.create({ user1, user2 })
        return  res.json(newConversacion)
    }
    res.json(conversacion)

}
