import { Router } from "express";
import {createPost,deletePost,getAll,updatePost} from '../controllers/postController.js'

const router = Router();

router.get('/getAll', getAll)
router.post('/createPost', createPost)
router.put('/update', updatePost)
router.delete('/delete', deletePost)

export default router