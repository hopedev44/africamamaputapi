import mongoose from "mongoose";
const managerSalarySchema = mongoose.Schema(
  {
    admin: {
      type: String,
      required: true,
    },
    manager_name: {
      type: String,
      required: true,
    },
    managerId: {
      type: String,
      required: true,
    },
    salaryForTheYear: {
      type: String,
      required: true,
    },
    salaryForTheMonth: {
      type: String,
      required: true,
    },
    salaryAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ManagerSalary = mongoose.model("ManagerSalary", managerSalarySchema);
export default ManagerSalary;
