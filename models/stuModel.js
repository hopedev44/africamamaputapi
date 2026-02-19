import mongoose from "mongoose";
const StuSchema = new mongoose.Schema(
  {
    sale_name: {
      type: String,
      required: true,
    },
    classname: {
      type: String,
      required: true,
    },

    roll_no: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    parents_name: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    previous_dues: {
      type: Number,
    },
    age: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    registration_fees: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stu", StuSchema);
