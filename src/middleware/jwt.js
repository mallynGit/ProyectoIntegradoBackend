import { default as jwt } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { checkToken } from '../utils/authToken.js'
dotenv.config()

export const verifyToken = (req, res, next) => {

    try {
        let token = req.headers.authorization

        if (token) {
            token.slice(0, 6) === 'Bearer' ? token = token.slice(7) : token
            let check = checkToken(token)
            if (check == false) {
                return res.status(401).send({ error: 'invalid-token' })
            } else if (check == 'expired') {
                return res.status(401).send({ error: 'expired' })
            }
        } else {
            return res.status(401).send({ error: 'no hay token' })
        }

        req.token = jwt.decode(token)
    } catch (err) {
        console.log(err);
    }
    next()
}

