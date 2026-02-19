import mongoose from "mongoose";

const PsySchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    marks: [
      {
        saleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        instruction: { type: Number, required: true },
        independently: { type: Number, required: true },
        punctuality: { type: Number, required: true },
        talking: { type: Number, required: true },
        eyecontact: { type: Number, required: true },
        remarks: { type: String, required: true },
        premarks: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Psy", PsySchema);
