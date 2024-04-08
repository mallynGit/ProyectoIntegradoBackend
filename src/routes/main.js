import {Router} from 'express'
import userRoutes from './userRoutes.js'
import authRoutes from './authRoutes.js'
import petRoutes from './petRoutes.js'
import postRoutes from './postRoutes.js'
import mediaRoutes from './mediaRoutes.js'
import commentRoutes from './commentRoutes.js'

const router = Router()

router.use('/user', userRoutes)
router.use('/auth', authRoutes)
router.use('/pets', petRoutes)
router.use('/posts', postRoutes)
router.use('/media', mediaRoutes)
router.use('/comments', commentRoutes)

router.get('/', (req, res) => {
    res.send('funcionando')
})

router.get('/test/test', (req, res) => {
    res.send('TEST FUNCIONANDO')
})

export default router
