import mongoose from "mongoose";
const saleSchema = mongoose.Schema(
  {
    registered_by: {
      type: String,
      required: true,
      ref: "Admin",
    },
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
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    registration_fees: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//the below is required code for converting the schema to the model
//as per the documentation of mongoose
//any name can be given as a constant in the place of the Sale
const Sale = mongoose.model("Sale", saleSchema);
//Sale variable is exported as follow is a ES module.
export default Sale;
