import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema(
  {
    grade_name: {
      type: String,
      required: true,
    },
    gradepoint: {
      type: Number,
      required: true,
    },
    markfrom: {
      type: Number,
      required: true,
    },
    markupto: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Grade", GradeSchema);
