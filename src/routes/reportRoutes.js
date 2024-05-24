import { Router } from "express";
import {createReport, deleteReport, getAll} from '../controllers/reporteController.js'

const router = Router();

router.get('/getAll', getAll)
router.post('/createReport', createReport)
router.delete('/delete', deleteReport)

export default router