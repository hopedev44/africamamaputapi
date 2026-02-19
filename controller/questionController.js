import Question from "../models/questionModel.js";

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    const {
      questionType,
      questionTitle,
      options,
      correctAnswer,
      possibleAnswers,
      mark,
      examId,
      onscreenMarking,
    } = req.body;

    let questionData = {
      questionType,
      questionTitle,
      mark,
      exam: examId,
    };

    if (questionType === "multiple_choice") {
      // For multiple-choice questions
      questionData.options = options.map((option) => ({
        option: option.option,
        isCorrect: option.isCorrect,
      }));
    } else if (questionType === "true_false") {
      // For True/False questions
      questionData.correctAnswer = correctAnswer;
    } else if (questionType === "fill_in_the_blanks") {
      // For Fill In The Blanks questions
      questionData.possibleAnswers = possibleAnswers;
    } else if (questionType === "theory") {
      // For Theory questions
      questionData.onscreenMarking = onscreenMarking;
    }
    const question = new Question(questionData);

    await question.save();
    res.json({ message: "Question saved successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve questions for a specific exam
export const getQuestions = async (req, res) => {
  try {
    const examId = req.params.examId; // You can obtain the examId from the route params

    const questions = await Question.find({ exam: examId });

    res.json(questions);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a question by ID
export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Use Mongoose to find and remove the question by ID
    const deletedQuestion = await Question.findByIdAndRemove(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// questionController.js

// Update a question by ID
export const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const { questionType, questionTitle, options, correctAnswer, mark } =
      req.body;

    // Find the question by ID
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update the question's fields
    question.questionType = questionType;
    question.questionTitle = questionTitle;
    question.options = options; // For multiple-choice questions
    question.correctAnswer = correctAnswer; // For True/False questions
    question.mark = mark;

    // Save the updated question
    await question.save();

    res.json({ message: "Question updated successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json(question);
  } catch {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the question" });
  }
};
