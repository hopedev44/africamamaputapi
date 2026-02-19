import mongoose from "mongoose";
const saleAttendanceSchema = mongoose.Schema({
  class_manager: {
    type: String,
    required: true,
  },
  attendance_date: {
    type: Date,
    default: Date.now(),
  },
  classname: {
    type: String,
    required: true,
  },
  sales: [
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
        required: true,
      },
      present: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    {
      timestamps: true,
    },
  ],
});

export default mongoose.model("SaleAttendance", saleAttendanceSchema);
