import express from "express";

import { createSchool } from "../controller/School.js";

const router = express.Router();

router.post("/registerschool", createSchool);

export default router;
