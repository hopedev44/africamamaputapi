// import mongoose from "mongoose";

// const DreamSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },

//   content: {
//     type: String,
//     required: true, // Ensure the generated content is saved
//   },
//   imageUrl: {
//     type: String,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Assuming you're linking visions to a user
//     required: true,
//   },
// });

// const Dream = mongoose.model("Dream", DreamSchema);

// export default Dream;
import mongoose from "mongoose";

const DreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // content: { type: String, required: true },
  userImageUrl: {
    type: String,
  },
  imageUrls: { type: [String], required: true }, // Store multiple image URLs
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isSaved: { type: Boolean, default: false },
  board: { type: Boolean, default: false },
});

const Dream = mongoose.model("Dream", DreamSchema);

export default Dream;
