// routes/ideaRoutes.js
import express from "express";
import {
  createIdea,
  deleteIdea,
  getAllIdeas,
  getIdeaById,
  getIdeasByVision,
  updateIdea,
} from "../controller/ideaController.js";
import authenticateUser from "../middleware/authMiddleware.js";
import multer from "multer";

import multerS3 from "multer-s3";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

router.post(
  "/create-plan",

  authenticateUser,
  createIdea
);

router.get("/get-idea/:id", authenticateUser, getIdeaById);

router.get("/ideas/:visionId", authenticateUser, getIdeasByVision);
// Define the route to get all ideas for the authenticated user
router.get("/all-ideas", authenticateUser, getAllIdeas);

router.put("/edit-idea/:id", authenticateUser, updateIdea);
// Delete an idea
router.delete("/idea/:id", authenticateUser, deleteIdea);

export default router;
