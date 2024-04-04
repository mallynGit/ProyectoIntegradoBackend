import {Router} from 'express'
import userRoutes from './userRoutes.js'
import authRoutes from './authRoutes.js'

const router = Router()

router.use('/user', userRoutes)
router.use('/auth', authRoutes)

router.get('/', (req, res) => {
    res.send('funcionando')
})

router.get('/test/test', (req, res) => {
    res.send('TEST FUNCIONANDO')
})

export default router
