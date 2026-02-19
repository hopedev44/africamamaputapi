import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    photos: {
      type: [String],
    },

    datePosted: {
      type: Date,
      required: true,
    },

    authorName: {
      type: String,
      required: true,
    },
    desc1: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
