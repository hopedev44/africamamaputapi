import mongoose from "mongoose";
const AuthUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,

      unique: true,
    },
    email: {
      type: String,

      unique: true,
    },

    phone: {
      type: Number,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuthUser", AuthUserSchema);
