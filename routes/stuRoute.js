// import express from "express";
// import {
//   allClass,
//   deleteSale,
//   getallUsers,
//   getuserClass,
//   getuserClass2,
//   getuserClass3,
//   getuserClass4,
//   getuserClass5,
//   getuserClass6,
//   getUsers,
//   loginUser,
//   register,
//   Search,
// } from "../controller/stuController.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", loginUser);
// router.get("/getallusers", getallUsers);
// router.get("/clo", getuserClass);
// router.get("/clo2", getuserClass2);
// router.get("/clo3", getuserClass3);
// router.get("/clo4", getuserClass4);
// router.get("/clo5", getuserClass5);
// router.get("/clo6", getuserClass6);

// router.get("/class/:id", allClass);
// router.delete("/delete/:id", deleteSale);
// router.get("/search/:name/:class/:roll_no", Search);
// router.get("/getusers/:id", getUsers);

// export default router;

// authRoutes.js
import express from "express";
import { getSalesByClass, getSaleById } from "../controller/stuController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// New route to get sales by class
router.get("/sales/:classname", getSalesByClass);
// Change the route pattern for getSaleById
router.get("/sale/:id", authenticateUser, getSaleById);

export default router;
