import mongoose from "mongoose";
const SchoolSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
    },
    lastname: {
      type: String,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"], // Define valid gender values
    },
    nationality: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    phone: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
    },
    classes: {
      type: String,

      enum: ["online", "offline"], // Define valid gender values
    },

    courses: [
      {
        type: String,
        enum: [
          "LPG(Cooking Gas) Sales and Management",
          "Construction and Installation of LPG (cooking gas)",
          "Oil and Gas Investment/Financial Freedom", // Include the modified value
          "Mentorship",
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("School", SchoolSchema);
