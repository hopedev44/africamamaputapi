import mongoose from "mongoose";

const scriptSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
  },

  saleName: {
    type: String,
  },

  answerScriptFiles: {
    type: Array,
  },
});

const Script = mongoose.model("Script", scriptSchema); // Change "School" to "Account"

export default Script;
