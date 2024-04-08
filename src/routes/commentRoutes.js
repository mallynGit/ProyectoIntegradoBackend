import { Router } from "express";
import {deleteComment, get, post, update} from '../controllers/comentarioController.js'

const router = Router();

router.get('/getAll', get)
router.post('/createComment', post)
router.put('/update', update)
router.delete('/delete', deleteComment)

export default router