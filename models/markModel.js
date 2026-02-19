// import mongoose from "mongoose";

// const MarkSchema = new mongoose.Schema(
//   {
//     examId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Exam",
//       required: true,
//     },
//     marks: [
//       {
//         subjectName: { type: String, required: true },
//         subjectId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Subject",
//         },
//         saleId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         }, // Change this line
//         examscore: { type: Number, required: true },
//         testscore: { type: Number, required: true },
//         marksObtained: { type: Number, required: true },
//         comment: { type: String },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Mark", MarkSchema);

import mongoose from "mongoose";

const MarkSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    marks: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
        saleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        examscore: { type: Number, required: true },
        testscore: { type: Number, required: true },
        marksObtained: { type: Number, required: true },
        comment: { type: String },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Mark", MarkSchema);
