import { model } from '../models/multimedia.js'

export const get = async (req, res) => {

    const { id } = req.query
    const media = await model.find({ _id: id })
    res.json(media)

}

export const post = async (req, res) => {
   
    res.json({ filename: req.params.filename })           

}

export const deleteMedia = async (req, res) => {

    const { id } = req.query
    model.findByIdAndDelete({ _id: id }).then((deleted) => {
        if(deleted == null){
            return res.status(404).send({ error: 'Media not found' })
        }
        res.json(deleted)
    }).catch((err) => {
        console.log(err)
        return res.status(500).send({ error: 'Error deleting media' })
    })

}