import mongoose from "mongoose";
const managerAttendanceSchema = mongoose.Schema({
  admin: {
    type: String,
    required: true,
  },
  attendance_date: {
    type: Date,
    default: Date.now(),
  },

  managers: [
    {
      manager_name: {
        type: String,
        required: true,
      },

      managerId: {
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

const TeacherAttendance = mongoose.model(
  "TeacherAttendance",
  managerAttendanceSchema
);
export default TeacherAttendance;
