import express from "express";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  checkFaceSwapStatus,
  fetchFaceSwapResult,
  generateDream,
  getMilestonePlan,
  getTemplateVisionById,
  getTemplateVisions,
  getTemplateVisionsBoard,
  // RemoveBg,
  requestFaceSwap,
  saveTemplateVision,
} from "../controller/aiController.js";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "eduprosolution",
    // acl: "private",
    ACL: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileKey = `dreams/${Date.now()}-${file.originalname}`;
      cb(null, fileKey);
    },
    expires: 60 * 60 * 24 * 7,
  }),
});

const router = express.Router();

// Route to generate dream with uploaded image
router.post(
  "/generate-dream",
  upload.single("image"),
  authenticateUser,
  (req, res, next) => {
    console.log("📂 Uploaded File:", req.file);
    next();
  },
  generateDream
);

// const upload = multer({ storage: multer.memoryStorage() }); // or multer-s3

// router.post("/remove-bg", upload.single("image"), authenticateUser, RemoveBg);

router.post("/create-template-vision", authenticateUser, saveTemplateVision);

// router.post("/face-swap", requestFaceSwap);
router.post(
  "/face-swap",
  upload.fields([{ name: "target_image" }, { name: "swap_image" }]), // Use existing multer-s3 instance
  requestFaceSwap
);
router.get("/face_swap/status/:task_id", checkFaceSwapStatus);

router.get("/fetch-result", fetchFaceSwapResult);

// Route to get all template visions for a specific user
router.get(
  "/get-template-visions/:userId",
  authenticateUser,
  getTemplateVisions
);
router.get(
  "/get-template-visions-board/:userId",
  authenticateUser,
  getTemplateVisionsBoard
);

// Route to get a specific vision by ID
router.get(
  "/get-template-vision/:visionId",
  authenticateUser,
  getTemplateVisionById
);
router.get("/generate-plan/:title", authenticateUser, getMilestonePlan);

export default router;
