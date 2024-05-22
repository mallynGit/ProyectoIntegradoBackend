import { model } from '../models/post.js'
import { model as petmodel } from '../models/pet.js'

export const getAll = async (req, res) => {

    const posts = await model.find({})
        .populate({ path: 'autor', select: '-password' })

    res.json(posts)

}

export const getByPetId = async (req, res) => {

    const { id } = req.params
    const pet = await petmodel.findById({ _id: id }).populate('posts')

    res.send(pet.posts)

}

export const getByPostId = async (req, res) => {

    const { id } = req.params
    const post = await model.findById({ _id: id })

    res.send(post)

}

export const createPost = async (req, res) => {

    const { titulo, contenido, pet, autor } = req.body

    console.log(req.files)
    let files = []
    for (let f of req.files) {
        files.push(f.filename.split('.')[0])
    }

    const post = await model.create({ titulo, contenido, multimedia: files, autor })
    const foundPet = await petmodel.findById({ _id: pet })
    if (foundPet == null) {
        return res.status(404).send("Pet not found")
    } else {
        foundPet.posts = foundPet.posts.concat(post._id)
        foundPet.save()
    }

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
        if (deleted == null) {
            return res.status(404).send({ error: 'Post not found' })
        }
        res.json(deleted)
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({ error: 'Error deleting post' })
    })

}