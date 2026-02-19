import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [8, "Password must not be less than 8 characters"],
    },
    resetLink: {
      data: String,
    
    },
    googleId: { type: String },
    accessToken: String,
    refreshToken: String,
    resetToken: String,
    expireToken: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // // //A DOCUMENT MIDDLEWARE THAT HASHES USER'S PASSWORD
    // UserSchema.pre('save', async function (next) {
    //     this.password = await bcrypt.hash(this.password, 10)
    //     next()
    // })

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", userSchema);