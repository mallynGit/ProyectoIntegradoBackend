import { Router } from "express";
import {deleteMedia, get, post} from '../controllers/mediaController.js'

const router = Router();

router.get('/getAll', get)
router.post('/post', post)
router.delete('/delete', deleteMedia)

export default router
