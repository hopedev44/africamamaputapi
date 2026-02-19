import mongoose from "mongoose";

const PointSchema = new mongoose.Schema(
  {
    pointId: {
      type: Number,
      required: true,
      unique: true,
    },
    pointname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    sales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming your sale model is named 'Sale'
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Point", PointSchema);
