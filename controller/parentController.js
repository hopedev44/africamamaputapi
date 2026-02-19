import express from "express";

import User from "../models/userModel.js"; // Replace with your actual model

const router = express.Router();

// Create a Manager (Authenticated Route)

export const createParent = async (req, res) => {
  try {
    // Verify the user role (only "admin" can create managers)
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Create a manager (You may customize this)
    const parent = new User({
      role: "parent",
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      phone: req.body.phone,

      // subjectTaught: req.body.subjectTaught, // Add other manager-specific fields
    });

    const createdParent = await parent.save();
    res.status(201).json(createdParent);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Managers (Authenticated Route)

export const getParent = async (req, res) => {
  try {
    // Verify the user role (only "admin" can get managers)
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Permission denied" });
    // }

    const parent = await User.find({ role: "parent" });
    res.status(200).json(parent);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export default router;
