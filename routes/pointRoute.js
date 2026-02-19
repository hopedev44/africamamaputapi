import express from "express";
import {
  createPoint,
  deletePoint,
  getPoint,
  getsinglePoint,
  updatePoint,
} from "../controller/pointController.js";

const router = express.Router();

//CREATE
router.post("/point", createPoint);

router.get("/point", getPoint);
router.get("/point/:id", getsinglePoint);

// Update a class
router.put("/point/:id", updatePoint);
router.delete("/point/:id", deletePoint);

export default router;
