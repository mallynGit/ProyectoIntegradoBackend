import express from 'express';
import { model } from '../models/user.js'
import db from '../db/db.js'
import { default as jwt } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { signToken } from '../middleware/jwt.js';

export const get = async (req, res) => {

    const { name } = req.query

    const user = await model.findOne({ name })
    delete user.password

    if (req.token) {
        res.json({user, token: req.token})
    } else {
        res.send({user, token: signToken({nick: user.nick})})
    }
}

export const post = async (req, res) => {

    const { name, email, password } = req.body

    const user = await model.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        nick: email.split('@')[0],
    })

    res.send(user)
}

export const update = async (req,res) => {

    const { id } = req.query
    const {name, nick} = req.body

    const user = await model.updateOne({ _id: id }, { name, nick })

    res.send(user)

}

