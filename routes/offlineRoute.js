import express from "express";
import { submitExam, deleteExam } from "../controller/OfflineExam.js";
import {
  getMark,
  getMarkbySale,
  getScores,
  saveMark,
  updateMark,
  updateMarks,
} from "../controller/offMarkController.js";

const router = express.Router();

//CREATE route
router.post("/offlineexam", submitExam);

router.post("/save-marks", saveMark);
// Add the new route for getting scores
router.get("/get-scores/:examName", getMark);

router.get(
  "/get-scores-by-sale/:saleId",
  // authenticateUser,
  getMarkbySale
);

router.get("/get-all-scores/:examId/:subjectId", getScores);

router.put("/update-all-marks", updateMarks);

router.put("/update-marks/:saleId", updateMark);
router.delete("/deleteexam/:examId", deleteExam);

export default router;
