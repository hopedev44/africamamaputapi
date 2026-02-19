import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examlist",
    required: true,
  },
  answers: {
    type: Object,
    required: true,
  },
  score: {
    type: Number,
  },
});

export default mongoose.model("Submission", SubmissionSchema);
