import { model } from '../models/post.js'

export const getAll = async (req, res) => {

    const posts = await model.find({})
    .populate({path: 'autor', select: '-password'})

    res.json(posts)

}

export const createPost = async (req, res) => {

    const { contenido, multimedia, autor } = req.body

    const post = await model.create({ contenido, multimedia, autor })

    res.json(post)

}

export const updatePost = (req, res) => {

    const { id } = req.query

    const { contenido, multimedia } = req.body

    model.findByIdAndUpdate({ _id: id }, { contenido, multimedia }, { new: true }).then((updated) => {
        res.json(updated)
    })

}

export const deletePost = (req, res) => {

    const { id } = req.query

    model.findByIdAndDelete({ _id: id }).then((deleted) => {
        if(deleted == null){
            return res.status(404).send({ error: 'Post not found' })
        }
        res.json(deleted)
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({ error: 'Error deleting post' })
    })

}