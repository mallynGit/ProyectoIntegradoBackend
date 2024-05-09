import { Router } from "express";
import { login, register, tokenCheck } from '../controllers/authController.js'
import { verifyToken } from '../middleware/jwt.js'
import upload from '../middleware/multer.js'

const router = Router();

router.post("/login", login)
router.post("/register", upload, register)
router.post("/check", tokenCheck)

export default router