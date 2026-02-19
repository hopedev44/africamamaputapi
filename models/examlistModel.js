import mongoose from "mongoose";

const ExamlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    fromTime: {
      type: String, // Change the type as needed (e.g., String for HH:mm format)
      required: true,
    },
    toTime: {
      type: String, // Change the type as needed (e.g., String for HH:mm format)
      required: true,
    },
    percent: {
      type: Number,
      required: true,
    },
    instruction: {
      type: String,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", // Reference to the "Question" model
      },
    ],
    submittedAnswers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
          select: "saleName",
        },
        answers: {
          type: Object, // Use a Map to store answers with question IDs as keys
          of: String, // Assuming answers are strings
        },
        score: {
          type: Number, // Add the score field to store the exam score
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Examlist", ExamlistSchema);
