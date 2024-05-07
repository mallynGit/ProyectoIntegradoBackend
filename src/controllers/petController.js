import { model } from '../models/pet.js'
import { model as media } from '../models/multimedia.js'
import fs from 'fs'

export const get = async (req, res) => {

    const pets = await model.find({}).populate(['foto_perfil', 'multimedia'])

    res.json(pets)

}

export const getById = async (req, res) => {
    const pet = await model.findById({ _id: req.params.id }).populate({ path: 'multimedia' })
    res.json(pet)
}

export const create = async (req, res) => {

    const { name, raza, categoria, edad } = req.body
    let pet, multimedia, mediaId
    try {
        if (req.file) {
            mediaId = req.file.filename.split('.')
            console.log(req.file)
            multimedia = await media.create({ _id: mediaId[0], tipo: mediaId[1] })
        }
        pet = await model.create({ name, raza, categoria, edad, foto_perfil: req.file ? multimedia._id : null })
        pet.multimedia.push(multimedia._id)
        pet.save()
    } catch (err) {
        console.log(err);
        return res.status(500).send({ error: 'Error creating pet' })
    }
    res.json(pet)

}

export const update = async (req, res) => {

    const { name, raza, categoria, edad, foto_perfil, _id } = req.body

    model.findByIdAndUpdate({ _id }, { name, raza, categoria, edad, foto_perfil }, { new: true }).then((updated) => {
        res.json({ updated })
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({ error: 'Error updating pet' })
    })

    // res.json(updatedPet)

}

export const deletePet = async (req, res) => {
    try {
        const { id } = req.query

        const deletedPet = await model.findByIdAndDelete({ _id: id }).populate({ path: 'multimedia' })
        console.log(deletedPet)
        for (let multimedia of deletedPet.multimedia) {
            await media.deleteOne({ _id: multimedia._id })
            console.log(multimedia._id + '.' + multimedia.tipo)
            fs.unlinkSync('./src/uploads/' + multimedia._id + '.' + multimedia.tipo)
        }

        if (deletedPet == null) {
            return res.status(404).send({ error: 'Pet not found' })
        }

        res.json({ msg: 'succesfully deleted', deletedPet })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: err })
    }
}