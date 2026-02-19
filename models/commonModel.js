// // import mongoose from "mongoose";

// // const userSchema = new mongoose.Schema(
// //   {
// //     role: {
// //       type: String,
// //       required: true,
// //       enum: ["admin", "manager", "sales", "users"], // Add other roles as needed
// //     },
// //     username: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //     },
// //     email: {
// //       type: String,
// //       required: true,
// //     },
// //     password: {
// //       type: String,
// //       required: true,
// //     },
// //     point: {
// //       type: String,
// //     },
// //     // Include additional fields that are common to all user roles
// //     personaladdress: {
// //       type: String,
// //       required: true,
// //     },
// //     phone: {
// //       type: Number,
// //       required: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // export default mongoose.model("User", userSchema);

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     role: {
//       type: String,
//       required: true,
//       enum: ["admin", "manager", "sales", "users"], // Add other roles as needed
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     managedPoints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Point" }],

//     personaladdress: {
//       type: String,
//       required: true,
//     },

//     phone: {
//       type: Number,
//       required: true,
//     },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);
