import express from "express";

import multer from "multer";
import multerS3 from "multer-s3";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

import {
  getByClassNameSaleAndSubject,
  uploadAndMarkAnswerScripts,
} from "../controller/onScreenController.js";
const router = express.Router();
// const applyAuthMiddleware = (method, path, middleware) => {
//   if (middleware) {
//     router[method](path, middleware);
//   }
// };

// Modify the commonRoute function to accept the s3 instance and authentication routes
const onScreenRoute = (s3 = []) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // const uploadDir = path.join(__dirname, "..", "uploads");

  // fs.mkdirSync(uploadDir, { recursive: true });

  // const uploadDir = process.env.UPLOADS_DIR || "/var/task/uploads";
  // fs.mkdirSync(uploadDir, { recursive: true });

  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "edupros", // Replace with your bucket name
      acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
  });
  router.post(
    "/upload-and-mark-answer-scripts",
    upload.array("answerScriptFiles"),
    uploadAndMarkAnswerScripts
  );
  router.get(
    "/data/:className/:saleName/:subject",
    getByClassNameSaleAndSubject
  );

  // router.post("/setting", upload.single("signature"), createSetting);

  // router.post("/account-setting", multer().single("schoolLogo"), (req, res) => {
  //   createAccount(req, res, s3);
  // });
  // router.post("/download", multer().single("Downloads"), (req, res) => {
  //   createDownload(req, res, s3);
  // });
  // router.post("/book", multer().single("Download"), (req, res) => {
  //   createBook(req, res, s3);
  // });

  // router.get("/setting", getSetting);
  // router.get("/download", getDownload);
  // router.get("/book", getBook);
  // router.get("/book/:id", getBookById);

  // router.get("/account-setting", getAccountSetting);

  return router;
};

export default onScreenRoute;
