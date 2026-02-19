import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    day: {
      type: Date,
      required: true,
    },
    activity: {
      type: String, // You can adjust this type based on your needs (e.g., if activities are stored as references to another collection)
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "inProgress", "completed"], // List all possible statuses
      default: "todo",
    },
    archived: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a "User" model for the authenticated user
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model("Task", taskSchema);
