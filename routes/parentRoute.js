import express from "express";
import { getParent, createParent } from "../controller/parentController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-parent", authenticateUser, createParent);
router.get("/get-parent", getParent);

export default router;
