import { default as jwt } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const verifyToken = (req, res, next) => {

    try {
        let token = req.headers.authorization

        if (token) {
            token.slice(0, 6) === 'Bearer' ? token = token.slice(7) : token
        }

        req.token = jwt.decode(token)
    } catch (err) {
        console.log(err);
    }

    next()


}

export const signToken = (payload) => {

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' })

}