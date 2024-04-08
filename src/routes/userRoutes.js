import { Router } from "express";
import { get, registerUser, update, deleteUser } from "../controllers/userController.js";

const router = Router();

router.get('/find', get);
router.post('/createUser', registerUser);
router.put('/update', update);
router.delete('/delete/:id', deleteUser);

export default router