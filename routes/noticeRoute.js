// authRoutes.js
import express from "express";

import {
  createNotice,
  deleteNotice,
  editNotice,
  getNotice,
  getNoticebyId,
  getallNotice,
} from "../controller/noticeController.js";

const router = express.Router();
router.get("/get-notice/:id", getNoticebyId);
router.post("/create-notice", createNotice);
router.get("/get-notice/:role", getNotice);

router.get("/get-all-notices", getallNotice);
router.put("/edit-notice/:id", editNotice);
router.delete("/delete-notice/:id", deleteNotice);

export default router;
