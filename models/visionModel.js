import mongoose from "mongoose";
const VisionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    affirmation: {
      type: String,
      required: true,
    },
    statement: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      required: true,
    },
    imageUrl: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you're linking visions to a user
      required: true,
    },
    board: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Vision", VisionSchema);
