import { Router } from "express";
import { get, registerUser, update, deleteUser, getPetsByUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/jwt.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get('/find', get);
router.post('/createUser', registerUser);
router.put('/update/:id', verifyToken, upload, update);
router.delete('/delete/:id', deleteUser);
router.get('/getUserPets/:id', getPetsByUser)

export default router