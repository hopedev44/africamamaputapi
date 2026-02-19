import express from "express";
import {
  createVision,
  getSingleVision,
  getAllVisions,
  getSingleVisionByTitle,
  editVision,
  deleteVision,
  MovetoBoard,
  MovetoBoardTemplate,
  getAllBoardVision,
} from "../controller/visionController.js";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import dotenv from "dotenv";
import authenticateUser from "../middleware/authMiddleware.js";
import fileUpload from "express-fileupload"; // To handle file uploads
import multer from "multer";

const router = express.Router();

// Middleware to handle file uploads

// Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Temporary directory where multer saves files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Unique filename for each upload
//   },
// });

// const upload = multer({ storage: storage });

dotenv.config();

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  requestHandler: new NodeHttpHandler({
    requestTimeout: 120000, // 2 minutes timeout
    connectionTimeout: 120000, // 2 minutes connection timeout
  }),
});

// Set up multer with multer-s3 for direct S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "eduprosolution",
    acl: "private", // Set access control list for the uploaded file
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type
    key: (req, file, cb) => {
      const fileKey = `visions/${Date.now()}-${file.originalname}`; // Unique filename
      cb(null, fileKey); // Upload to "visions" folder in the S3 bucket
    },
  }),
});

// Create Vision Route
// router.post("/create-vision", authenticateUser, createVision);

router.post(
  "/create-vision",
  upload.single("image"),
  authenticateUser,
  createVision
);

// Get Single Vision Route
router.get("/get-single/:id", authenticateUser, getSingleVision);
router.get(
  "/get-single-by-title/:title",
  authenticateUser,
  getSingleVisionByTitle
);
// Edit Vision Route
router.put(
  "/editvision/:id",
  upload.single("image"), // Optional file upload for image updates
  authenticateUser,
  editVision
);

// Delete Vision Route
router.put("/move-to-board/:id", authenticateUser, MovetoBoard);
router.put(
  "/move-to-board-template/:id",
  authenticateUser,
  MovetoBoardTemplate
);
router.delete("/vision/:id", authenticateUser, deleteVision);

// Get All Visions Route
router.get("/get-all", authenticateUser, getAllVisions);
router.get("/get-all-board", authenticateUser, getAllBoardVision);

export default router;
