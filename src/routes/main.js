import {Router} from 'express'
import userRoutes from './userRoutes.js'
import authRoutes from './authRoutes.js'
import petRoutes from './petRoutes.js'
import postRoutes from './postRoutes.js'
import commentRoutes from './commentRoutes.js'
import reportRoutes from './reportRoutes.js'
import conversationRoutes from './conversationRoutes.js'
import {default as ws} from '../server/websocket.js'

const router = Router()

router.use('/user', userRoutes)
router.use('/auth', authRoutes)
router.use('/pets', petRoutes)
router.use('/posts', postRoutes)
router.use('/comments', commentRoutes)
router.use('/reports', reportRoutes)
router.use('/chat', conversationRoutes)

router.get('/', (req, res) => {
    res.send('funcionando')
})

router.get('/test/test', (req, res) => {
    console.log(ws.options, 'va')
    res.send('TEST FUNCIONANDO')
})


export default router
