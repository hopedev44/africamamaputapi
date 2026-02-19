// import mongoose from "mongoose";

// const CatSchema = new mongoose.Schema(
//   {
//     catName: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Cat", CatSchema);

// models/categoryModel.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null means it's a top-level category
    },
    image: {
      type: String, // Store the image URL or filename
    },
    icon: {
      type: String, // Emoji or icon name
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
