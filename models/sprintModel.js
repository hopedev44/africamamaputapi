import mongoose from "mongoose";

const SprintSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      trim: true,
    },
    activity: {
      type: String,
      required: true,
    },

    refineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Refine",
      required: true,
    },
    // visionId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Vision",
    //   required: [true, "Vision ID is required"],
    // },
    tasks: [
      {
        title: { type: String, required: true },
        description: { type: String },
        status: {
          type: String,
          enum: ["todo", "inProgress", "completed"],
          default: "todo",
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sprint", SprintSchema);
