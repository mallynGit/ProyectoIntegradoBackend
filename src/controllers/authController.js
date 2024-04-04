import { model } from '../models/user.js'
import bcrypt from 'bcrypt'
import { signToken } from '../middleware/jwt.js';

export const login = async (req, res) => {

    const { email, password } = req.body

    const user = await model.findOne({ email })

    if (!user) {
        return res.status(404).send({ error: 'User not found' })
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({ error: 'Login failed' })
    }

    res.send(signToken({ nick: user.nick, _id: user._id }))

}
