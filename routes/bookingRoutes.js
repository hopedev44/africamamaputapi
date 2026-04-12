import express from "express";
import { createBooking } from "../controller/bookingController.js";

const router = express.Router();

router.post("/", createBooking);

export default router;