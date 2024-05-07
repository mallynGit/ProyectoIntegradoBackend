
import { model } from '../models/user.js'

import bcrypt from 'bcrypt'

export const get = async (req, res) => {

    const { name } = req.query

    if (!name) {
        return res.send(await model.find({}, { password: 0 }))
    }
    const user = await model.findOne({ name })
    delete user.password

    if (req.token) {
        res.json({ user, token: req.token })
    } else {
        res.send({ user, token: signToken({ nick: user.nick }) })
    }
}

export const registerUser = async (req, res) => {

    const { nombre, apellidos, email, password, nick } = req.body

    const user = await model.create({
        nombre,
        apellidos,
        email,
        password: bcrypt.hashSync(password, 10),
        nick: nick ? nick : email.split('@')[0],
    })

    res.send(user)
}

export const update = async (req, res) => {

    const { id } = req.params
    const { nombre, apellidos, email, nick } = req.body

    console.log(req.body)

    const user = await model.findOneAndUpdate({ _id: id }, { nombre, apellidos, email, nick })
    res.send(user)

}

export const deleteUser = async (req, res) => {

    const { id } = req.params

    const user = await model.deleteOne({ _id: id }, {}, { new: true })

    res.send(user)

}