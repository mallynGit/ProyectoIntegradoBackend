import { default as jwt } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' })
}

export const decodeToken = (payload) => {
    return jwt.decode(payload)
}

export const checkToken = (payload) => {
    return jwt.verify(payload, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return false
        }
        return true
    })
}