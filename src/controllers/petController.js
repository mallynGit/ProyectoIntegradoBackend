import { model } from '../models/pet.js'

export const get = async (req, res) => {

    const pets = await model.find({})

    res.json(pets)

}

export const create = async (req, res) => {

    const { name, raza, categoria, edad, foto_perfil } = req.body
    let pet
    try{
    pet = await model.create({ name, raza, categoria, edad, foto_perfil })
    }catch(err){
        console.log(err);
        return res.status(500).send({ error: 'Error creating pet' })
    }
    res.json(pet)

}

export const update = async (req, res) => {

    const { id } = req.query

    const { name, raza, categoria, edad, foto_perfil } = req.body

    model.findByIdAndUpdate({ _id: id }, { name, raza, categoria, edad, foto_perfil }, { new: true }).then((updated) => {
        res.json({updated})
    }).catch((err) => {
        console.log(err);
        return res.status(500).send({ error: 'Error updating pet' })
    })

    // res.json(updatedPet)

}

export const deletePet = async (req, res) => {

    const { id } = req.query

    const deletedPet = await model.findByIdAndDelete({ _id: id })

    if(deletedPet == null){
        return res.status(404).send({ error: 'Pet not found' })
    }

    res.json({msg: 'succesfully deleted', deletedPet})

}