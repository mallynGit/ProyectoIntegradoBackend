import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.send('funcionando')
})

router.get('/test/test', (req, res) => {
    res.send('TEST FUNCIONANDO')
})

export default router
