// models/Receipt.js
import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema(
  {
    typeOfPayment: {
      type: String,
      enum: ["Cash", "Transfer", "Cheque"],
    },
    status: {
      type: String,
      enum: ["Pending", "Success"],
    },
    reason: {
      type: String,
      required: true,
    },
    saleName: {
      type: String, // Assuming the sale's name is a string
      required: true,
    },
    classname: {
      type: String,
      required: true,
    },
    paid: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Receipt", ReceiptSchema);
