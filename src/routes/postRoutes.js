import { Router } from "express";
import { createPost, deletePost, getAll, getByPetId, updatePost } from '../controllers/postController.js'
import { multi } from "../middleware/multer.js";

const router = Router();

router.get('/getAll', getAll)
router.post('/createPost', multi, createPost)
router.put('/update', updatePost)
router.get('/:id', getByPetId)
router.delete('/delete', deletePost)

export default router