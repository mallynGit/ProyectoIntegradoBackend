import { Router } from "express";
import { deleteMedia, get, post } from '../controllers/mediaController.js'
import upload from "../middleware/multer.js";

const router = Router();

router.get('/getAll', get)
router.post('/post', upload, post)
router.delete('/delete', deleteMedia)

export default router
