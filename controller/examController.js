import Exam from "../models/examlistModel.js";
import User from "../models/userModel.js";

export const submitExam = async (req, res) => {
  try {
    const { examId, answers, userId, score } = req.body; // Include the "score" in the destructuring

    if (!examId || !answers || !userId) {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    // Fetch the exam and ensure it exists
    const exam = await Exam.findById(examId).populate("questions");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Update the user's score in the exam
    const userSubmittedAnswers = {
      userId,
      answers,
      score, // Use the received score
    };

    exam.submittedAnswers.push(userSubmittedAnswers);
    await exam.save();

    res.json({
      message: "Exam submitted successfully",
      score, // Respond with the received score
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getExamScore = async (req, res) => {
  try {
    const { examId, userId } = req.params;

    if (!examId || !userId) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    // Find the exam by its ID
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Find the sale's submission within the exam
    const submission = exam.submittedAnswers.find(
      (answer) => answer.userId.toString() === userId
    );

    if (!submission) {
      return res.status(404).json({ message: "Sale submission not found" });
    }

    // Retrieve the sale's score and user details
    const { score } = submission;
    const sale = await User.findById(userId);

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    // Respond with the sale's name and score
    res.json({
      saleName: sale.saleName,
      score,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllScore = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!examId) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    // Find the exam by its ID and populate the submittedAnswers field
    const exam = await Exam.findById(examId).populate({
      path: "submittedAnswers.userId", // Reference to the User model
      select: "saleName", // Include the saleName field
    });

    // Log the userId
    console.log(
      "User IDs:",
      exam.submittedAnswers.map((submission) => submission.userId)
    );

    // Extract the sale names and scores
    const saleScores = exam.submittedAnswers.map((submission) => {
      const { userId, score } = submission;
      return {
        saleName: userId.saleName,
        score,
      };
    });

    console.log("Sale Scores:", saleScores);

    res.json(saleScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllSaleScores = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    // Find all exams that the sale has submitted answers for
    const exams = await Exam.find({
      "submittedAnswers.userId": userId,
    }).populate({
      path: "submittedAnswers",
      match: { userId }, // Filter by userId
    });

    // Extract sale names, exam titles, and scores
    const saleScores = exams.map((exam) => {
      const { title, subject } = exam;
      const submission = exam.submittedAnswers.find(
        (answer) => answer.userId.toString() === userId
      );
      const { score } = submission;
      return {
        examTitle: title,
        subject,
        score,
      };
    });

    console.log("Sale Scores:", saleScores);

    res.json(saleScores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
