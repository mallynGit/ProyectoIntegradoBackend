import {
  testChat,
  createChat,
  get,
  getAll,
  addMessage
} from "../controllers/conversationController.js";
import { Router } from "express";

const router = Router();

router.post("/testChat", testChat);
router.post("/createChat", createChat);
router.get("/get", get);
router.get("/getAll", getAll);
router.post("/sendMsg", addMessage);

export default router;
