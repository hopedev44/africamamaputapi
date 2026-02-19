import Exam from "../models/examModel.js";

export const submitExam = async (req, res) => {
  const newExam = new Exam(req.body); // Include the "score" in the destructuring

  try {
    const savedExam = await newExam.save();
    res.status(200).json(savedExam);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getExam = async (req, res) => {
  try {
    const list = await Exam.find();
    res.status(200).json(list);
  } catch (err) {
    console.error("Error fetching exams:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the examsiner" });
  }
};

// Save exam marks
export const deleteExam = async (req, res) => {
  const examId = req.params.examId;

  try {
    // Find and delete the exam by ID
    const deletedExam = await Exam.findByIdAndDelete(examId);

    if (!deletedExam) {
      // If exam is not found
      return res.status(404).json({ error: "Exam not found" });
    }

    // Respond with a success message or additional data if needed
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
