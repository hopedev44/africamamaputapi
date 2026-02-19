import express from "express";
import { getExam } from "../controller/OfflineExam.js";

const router = express.Router();

router.get("/getofflineexam", getExam);

export default router;
