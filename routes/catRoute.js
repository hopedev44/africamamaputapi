// import express from "express";

// import { createCat } from "../controller/catController.js";

// const router = express.Router();

// //CREATE
// router.post("/category", createCat);

// export default router;
// routes/categoryRoutes.js
import express from "express";
import multer from "multer";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
} from "../controller/catController.js";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
const router = express.Router();

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
    bucket: "edupros",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileKey = `category/${Date.now()}-${file.originalname}`;
      cb(null, fileKey);
    },
    expires: 60 * 60 * 24 * 7,
  }),
});

// POST /api/categories
router.post("/category", upload.single("image"), createCategory);

// GET /api/categories
router.get("/categories", getAllCategories);
router.get("/category/:id", getCategoryById);

router.put("/category/:id", upload.single("image"), updateCategory);

// DELETE CATEGORY
router.delete("/category/:id", deleteCategory);

export default router;
