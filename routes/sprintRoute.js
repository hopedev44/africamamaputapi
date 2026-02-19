import express from "express";
import {
  archiveTask,
  createCalendarEvent,
  createSprint,
  deleteSprint,
  editTask,
  getAllSprints,
  getSprintByRefineTitlt,
  getSprintsByRefine,
  getTask,
  saveTask,
  updateTaskStatus,
} from "../controller/sprintController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a sprint
router.post("/sprints", authenticateUser, createSprint);

router.post("/save-task", authenticateUser, saveTask);
router.post("/event", authenticateUser, createCalendarEvent);

router.get("/tasks", authenticateUser, getTask);

router.get(
  "/sprint-by-refine-activity",
  authenticateUser,
  getSprintByRefineTitlt
);

router.get("/sprints/refine/:refineId", authenticateUser, getSprintsByRefine);
// router.js or your routing file
router.get("/getall-sprints", authenticateUser, getAllSprints);

// Update a task
router.put("/edit-task/:id", authenticateUser, editTask);
router.put("/update-task-status/:taskId", updateTaskStatus);
router.put("/archive-task/:id", authenticateUser, archiveTask);

// Delete a sprint
router.delete("/sprints/:id", authenticateUser, deleteSprint);

// Get all sprints for a specific refine

export default router;
