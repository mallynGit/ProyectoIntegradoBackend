import { Router } from "express";
import {
  checkResuelto,
  createReport,
  deleteReport,
  getAll,
} from "../controllers/reporteController.js";

const router = Router();

router.get("/getAll", getAll);
router.post("/createReport", createReport);
router.delete("/delete", deleteReport);
router.put("/checkResuelto", checkResuelto);

export default router;
