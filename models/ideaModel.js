import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema(
  {
    ideas: [
      {
        day: String,
        idea: String,
      },
    ],
    visionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dream",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Idea", IdeaSchema);
