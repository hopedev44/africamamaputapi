
// import mongoose from "mongoose";
// import slugify from "slugify";

// const categorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     slug: {
//       type: String,
//       unique: true, // ensures no two categories have the same slug
//       index: true,  // optional but improves query performance
//     },
//     parent: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "DbCategory",
//       default: null, // null means it's a top-level category
//     },
//     image: {
//       type: String, // Store the image URL or filename
//     },
//     icon: {
//       type: String, // Emoji or icon name
//     },
//   },
//   { timestamps: true }
// );

// // Pre-save hook to generate slug from name
// categorySchema.pre("save", function (next) {
//   if (this.isModified("name")) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//   }
//   next();
// });

// export default mongoose.model("DbCategory", categorySchema);
import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DbCategory",
      default: null,
    },
    image: String,
    icon: String,
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

/* ✅ SERVERLESS-SAFE EXPORT */
export default mongoose.models.DbCategory ||
  mongoose.model("DbCategory", categorySchema);
