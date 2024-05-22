import { Router } from "express";
import {deleteComment, get, post, update, reply} from '../controllers/comentarioController.js'

const router = Router();

router.get('/getAll', get)
router.post('/post', post)
router.post('/reply', reply)
router.put('/update', update)
router.delete('/delete', deleteComment)

export default router