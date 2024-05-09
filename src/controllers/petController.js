import { model } from '../models/pet.js'
import { model as media } from '../models/multimedia.js'
import { model as user } from '../models/user.js'
import fs from 'fs'

export const get = async (req, res) => {

    let pets = await model.find({}).populate(['foto_perfil', 'multimedia'])
    const test = await model.aggregate([
        {
            $lookup: {
                from: "users",
                localField: '_id',
                foreignField: 'pets',
                as: 'master'
            }
        },
    ]).unwind('$master');

    const hola = await model.populate(test, { path: 'foto_perfil multimedia' })
    const adios = await user.populate(hola, { path: 'master', select: '-password -pets -posts -role -email' })

    const puppets = await user.find({ pets: { $exists: true, $not: { $size: 0 } } })


    for (let master of puppets) {
        for (let pet of pets) {
            if (master.pets.includes(pet._id)) {
                pet.master = master
                console.log(pet, 'entra!!!!!!!!!!!')
            }
        }
    }
    console.log(adios, 'test')
    res.json(adios)

}

export const getById = async (req, res) => {
    const pet = await model.findById({ _id: req.params.id }).populate({ path: 'multimedia' })
    res.json(pet)
}

export const create = async (req, res) => {

    const { nombre, raza, categoria, edad, userId } = req.body
    let pet, multimedia, mediaId
    try {
        if (req.file) {
            mediaId = req.file.filename.split('.')
            console.log(req.file)
            multimedia = await media.create({ _id: mediaId[0], tipo: mediaId[1] })
        }
        let petMaster = await user.findById({ _id: userId })
        pet = await model.create({ nombre, raza, categoria, edad, foto_perfil: req.file ? multimedia._id : null })
        if (petMaster.pets.includes(pet._id)) {
            petMaster.pets.splice(petMaster.pets.indexOf(pet._id), 1)
            return res.status(500).send({ error: 'Error creating pet' })
        } else {
            petMaster.pets.push(pet._id)
            petMaster.save()
        }
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