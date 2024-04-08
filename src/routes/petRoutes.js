import { Router } from 'express';
import { create, deletePet, get, update } from '../controllers/petController.js'

const router = Router();

router.get('/getAll', get)
router.post('/createPet', create)
router.put('/update', update)
router.delete('/delete', deletePet)

export default router