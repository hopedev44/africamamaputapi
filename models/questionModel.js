import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionType: String, // "multiple_choice" or "true_false"
  questionTitle: String,
  //   options: [String], // For multiple-choice questions
  options: [
    {
      option: String,
      isCorrect: Boolean,
    },
  ],
  correctAnswer: String, // For True/False questions
  mark: Number,
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examlist", // Reference to the Exam model
  },
  // Add more fields as needed
  possibleAnswers: [String],

  onscreenMarking: String, // Add onscreenMarking field here
});

export default mongoose.model("Question", questionSchema);
