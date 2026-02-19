import express from "express";
import {
  deleteGrade,
  getGrade,
  getsingleGrade,
  createGrade,
  updateGrade,
} from "../controller/gradeController.js";

const router = express.Router();

//CREATE
router.post("/grade", createGrade);
// router.delete("/grade/:id", deleteGrade);

router.get("/grade", getGrade);
router.get("/grade/find/:id", getsingleGrade);
router.put("/grade/:id", updateGrade);

router.delete("/grade/:id", deleteGrade);
export default router;
