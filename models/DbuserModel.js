import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minlength: 8 },
    isAdmin: { type: Boolean, default: false },  // 👈 add this
    googleId: { type: String },
    resetToken: String,
    expireToken: Date,
  },
  { timestamps: true }
);

export default mongoose.models.DbUser || mongoose.model("DbUser", userSchema);