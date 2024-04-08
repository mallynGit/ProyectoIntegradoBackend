import { model } from '../models/comentario.js'

export const get = async (req, res) => {

    const comments = await model.find({}).populate({ path: 'autor', select: 'nick' })
    res.json(comments)

}

export const post = async (req, res) => {

    const { contenido, autor } = req.body
    const comment = await model.create({ contenido, autor })
    res.json(comment)
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