import express from "express";
import { getManagers, createManager } from "../controller/managerController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-managers", authenticateUser, createManager);
router.get("/get-managers", getManagers);

export default router;
