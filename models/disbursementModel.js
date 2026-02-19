import mongoose from "mongoose";

const disbursementSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    salesperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    allocatedDate: {
      type: Date,
      default: Date.now,
    },
    approvedDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Disbursement", disbursementSchema);
