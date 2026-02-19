import express from "express";
import { getExam, submitExam, deleteExam } from "../controller/OfflineExam.js";
import {
  getMark,
  getPsybySale,
  getScores,
  savePsy,
  updateMark,
  updateMarks,
} from "../controller/psyController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

//CREATE route
router.post("/offlineexam", submitExam);

router.get("/getofflineexam", getExam);
router.post("/save-psy", savePsy);
// Add the new route for getting scores
router.get("/get-scores/:examName", getMark);

router.get("/get-psy-by-sale/:saleId", authenticateUser, getPsybySale);

router.get("/get-all-psy/:examId", getScores);

router.put("/update-all-psy", updateMarks);

router.put("/update-marks/:saleId", updateMark);
router.delete("/deleteexam/:examId", deleteExam);

export default router;
