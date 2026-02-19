import Grade from "../models/gradeModel.js";
export const createGrade = async (req, res) => {
  const newGrade = new Grade(req.body);
  try {
    const savedGrade = await newGrade.save();
    res.status(200).json(savedGrade);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
//GET RESULT
export const getGrade = async (req, res) => {
  try {
    const list = await Grade.find();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getsingleGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);
    res.status(200).json(grade);
  } catch (err) {
    next(err);
  }
};
// export const deleteGrade = async (req, res, next) => {
//   try {
//     await Grade.findByIdAndDelete(req.params.id);
//     res.status(200).json("Grade has been deleted.");
//   } catch (err) {
//     next(err);
//   }
// };

export const deleteGrade = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findById(id);

    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    await grade.remove();

    res.status(200).json({ message: "Grade deleted successfully" });
  } catch (error) {
    console.error("Error deleting grade:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGrade = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findById(id);

    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    // Update grade properties based on the request body
    grade.grade_name = req.body.grade_name;
    grade.gradepoint = req.body.gradepoint;
    grade.markfrom = req.body.markfrom;
    grade.markupto = req.body.markupto;
    grade.comment = req.body.comment;

    await grade.save();

    res.status(200).json({ message: "Grade updated successfully", grade });
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
