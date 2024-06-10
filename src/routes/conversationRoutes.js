import {
  testChat,
  createChat,
  get,
  addMessage,
  getAllByUser,
  downloadChat
} from "../controllers/conversationController.js";
import { Router } from "express";

const router = Router();

router.post("/testChat", testChat);
router.post("/createChat", createChat);
router.get("/get", get);
router.get("/getAll", getAllByUser);
router.post("/sendMsg", addMessage);
router.get('/download', downloadChat)

export default router;
