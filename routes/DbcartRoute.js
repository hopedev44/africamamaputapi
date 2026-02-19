
import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import {  assignUserToCart, getCartByCartId, getCartByUser, initCart, saveCart } from "../controller/DbcartController.js";


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
      const fileKey = `cart/${Date.now()}-${file.originalname}`;
      cb(null, fileKey);
    },
  }),
});

// Routes

router.post("/cart/init", initCart);
router.get("/cart/user", getCartByUser);           // NEW
router.get("/cart", getCartByCartId);
router.post("/cart", saveCart);
router.post("/cart/assign", assignUserToCart);

export default router;
