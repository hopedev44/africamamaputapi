import express from "express";
import {
  initializePayment,

} from "../controller/PaymentController.js";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { createCheckoutSession } from "../controller/PaymentController.js";
import { stripeWebhook } from "../controller/webHookController.js";
const router = express.Router();

router.post("/initialize", initializePayment);
router.post("/create-checkout-session", createCheckoutSession);
router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;



