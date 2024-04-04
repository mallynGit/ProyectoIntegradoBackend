import { Router } from "express";
import {post, get} from "../controllers/userController.js";

const router = Router();

router.get('/find', get);
router.post('/createUser', post)

export default router