import express from "express";
import products from "../data.js";
import Cause from "../models/cause.js";

import mongoose from "mongoose";
//import db2 from "../config/db2";
const router = express.Router();

/*export const createProperties = async (req, res, next) => {
  const newProperties = new Properties(req.body);

  try {
    const savedProperties = await newProperties.save();
    res.status(200).json(savedProperties);
  } catch (err) {
    next(err);
  }
};*/

/*router.post("/register", async (req, res, next) => {
  try {
    const newUser = new Stu({
      ...req.body,
    });
    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
});
*/
/*router.post(
  "/register",
  //the protect used here is used for getting the id of the admin who registered the teacher

  async (req, res) => {
    const new_staff = new Stu(req.body);

    try {
      const new_staff = await Stu.create(req.body);
      console.log(new_staff);
      res.status(200).json(new_staff);
    } catch (err) {
      next(err);
    }
  }
);*/
router.post("/", async (req, res) => {
  const cause = new Cause({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    description: req.body.description,
  });
  return cause
    .save()
    .then((newCause) => {
      return res.status(201).json({
        success: true,
        message: "New cause created successfully",
        Cause: newCause,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: error.message,
      });
    });
});
router.get("/", (req, res) => {
  const newProducts = products.find((product) => {
    const { id, name, email } = product;
    return { id, name, email };
  });
  res.json(newProducts);
});

//for the fees of sales

export default router;
