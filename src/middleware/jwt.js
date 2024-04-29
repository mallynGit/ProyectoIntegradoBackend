import { default as jwt } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { checkToken } from '../utils/authToken.js'
dotenv.config()

export const verifyToken = (req, res, next) => {

    try {
        let token = req.headers.authorization

        if (token) {
            token.slice(0, 6) === 'Bearer' ? token = token.slice(7) : token

            if (checkToken(token) == false) {
                return res.status(401).send({ error: 'Invalid token jwt' })
            }
        } else{
            console.log(req, '?')
            return res.status(401).send({ error: 'no hay token'})
        }

        req.token = token
    } catch (err) {
        console.log(err);
    }

    next()


}

