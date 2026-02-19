// schoolModel.js
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  signature: {
    type: String, // You can store the file path or base64 representation
  },
  principalName: {
    type: String,
  },
  resumptionDate: {
    type: Date,
  },
});

const School = mongoose.model("Setting", settingSchema);

export default School;
