import { Router } from "express";
import {
  create,
  deletePet,
  get,
  update,
  getById,
  addMedia,
} from "../controllers/petController.js";
import upload from "../middleware/multer.js";

const router = Router();

router.get("/getAll", get);
router.get("/get/:id", getById);
router.post("/createPet", upload, create);
router.put("/update", upload, update);
router.delete("/delete", deletePet);
router.post("/uploadPicture", upload, addMedia);

export default router;
