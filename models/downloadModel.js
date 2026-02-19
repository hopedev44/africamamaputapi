import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
  className: {
    type: String,
  },
  subject: {
    type: String,
  },

  Downloads: {
    type: String,
  },
});

const Download = mongoose.model("Download", downloadSchema); // Change "School" to "Account"

export default Download;
