import { Router } from 'express';
import { create, deletePet, get, update, getById } from '../controllers/petController.js'
import upload from '../middleware/multer.js';

const router = Router();

router.get('/getAll', get)
router.get('/get/:id', getById)
router.post('/createPet', upload, create)
router.put('/update', update)
router.delete('/delete', deletePet)

export default router