import { Router } from "express";
import { login, register, tokenCheck } from '../controllers/authController.js'
import { verifyToken } from '../middleware/jwt.js'
import {default as upload, multi} from '../middleware/multer.js'


const router = Router();

router.post("/login", login)
router.post("/register",  multi, register)
router.post("/check", tokenCheck)

export default router