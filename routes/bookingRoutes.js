import express from "express";
import { createBooking, getAllBookings } from "../controller/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);   // ← add this
export default router;