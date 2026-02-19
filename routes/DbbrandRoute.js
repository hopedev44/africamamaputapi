// // routes/brandRoutes.js
// import express from "express";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import AWS from "aws-sdk";
// import { createBrand, getBrands } from "../controller/brandController.js";

// const router = express.Router();

// // AWS S3 setup
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// // Multer-S3 storage for brand image
// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: "edupros",
//     acl: "public-read", // allow public access to images
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//       const fileKey = `brands/${Date.now()}-${file.originalname}`;
//       cb(null, fileKey);
//     },
//   }),
// });

// // Routes
// router.post("/create-brand", upload.single("image"), createBrand);
// router.get("/brands", getBrands);

// export default router;
// routes/brandRoutes.js
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { createBrand, getBrands } from "../controller/DbbrandController.js";

const router = express.Router();

// AWS S3 setup (v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  signatureVersion: "v4",
});

// Fix for ACL issues with v3 + multer-s3
function multerS3NoAcl(options) {
  const storage = multerS3(options);

  const origGetS3Params = storage.getS3Params;
  storage.getS3Params = (file, cb) => {
    origGetS3Params.call(storage, file, (err, params) => {
      if (params.ACL) {
        delete params.ACL; // remove unsupported ACL
      }
      cb(err, params);
    });
  };

  return storage;
}

// Multer-S3 storage for brand image
const upload = multer({
  storage: multerS3NoAcl({
    s3,
    bucket: "edupros",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileKey = `dbbrands/${Date.now()}-${file.originalname}`;
      cb(null, fileKey);
    },
  }),
});

// Routes
router.post("/create-brand", upload.single("image"), createBrand);
router.get("/brands", getBrands);

export default router;
