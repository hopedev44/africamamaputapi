// examRoutes.js

import express from "express";
import {
  getAllScore,
  getExamScore,
  submitExam,
  getAllSaleScores,
} from "../controller/examController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a route for submitting an exam
router.post("/exams/submit", authenticateUser, submitExam);

// Create a route to get the sale's score and name
router.get("/exams/score/:examId/:userId", authenticateUser, getExamScore);
router.get("/sales/all-scores/:userId", authenticateUser, getAllSaleScores);

// Create a route to get all sales' scores for a specific exam
router.get("/exams/all-scores/:examId", getAllScore);

export default router;
