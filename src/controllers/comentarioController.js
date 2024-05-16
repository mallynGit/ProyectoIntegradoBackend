import { model } from '../models/comentario.js'
import { model as user } from '../models/user.js'
import { model as pet } from '../models/pet.js'

export const get = async (req, res) => {

    const comments = await model.find({}).populate({ path: 'autor', select: 'nick' })
    res.json(comments)

}

export const post = async (req, res) => {

    const { contenido, autor, perfil } = req.body
    const comment = await model.create({ contenido, autor })

    const foundUser = await user.findOne({ _id: perfil })
    const foundPet = await pet.findOne({ _id: perfil })

    console.log(foundPet, foundUser, ':)')
    if (foundUser) {
        foundUser.comentarios.push(comment._id)
        foundUser.save()
        return res.json(foundUser)
    } else if (foundPet) {
        console.log(foundPet.comentarios, 'foundPet.comments')
        foundPet.comentarios.push(comment._id)
        foundPet.save()
        return res.json(foundPet)
    } else {
        return res.status(404).send({ error: 'User or pet not found' })
    }
}

export const update = async (req, res) => {

    const { id } = req.query
    const { contenido } = req.body
    const comment = await model.findByIdAndUpdate({ _id: id }, { contenido }, { new: true })
    res.json(comment)
}

export const deleteComment = async (req, res) => {

    const { id } = req.query
    model.findByIdAndDelete({ _id: id }).then((deleted) => {
        if (deleted == null) {
            return res.status(404).send({ error: 'Comment not found' })
        }
        res.json(deleted)
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({ error: 'Error deleting comment' })
    })

}