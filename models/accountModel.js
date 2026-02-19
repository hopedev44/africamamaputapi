// // schoolModel.js
// import mongoose from "mongoose";

// const accountSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   motto: {
//     type: String, // You can store the file path or base64 representation
//   },
//   address: {
//     type: String, // You can store the file path or base64 representation
//   },
//   phone: {
//     type: String, // You can store the file path or base64 representation
//   },
//   phonetwo: {
//     type: String, // You can store the file path or base64 representation
//   },
//   currency: {
//     type: String, // You can store the file path or base64 representation
//   },
//   email: {
//     type: String, // You can store the file path or base64 representation
//   },
//   sessionStart: {
//     type: String, // You can store the file path or base64 representation
//   },
//   sessionEnd: {
//     type: String, // You can store the file path or base64 representation
//   },
//   schoolLogo: {
//     type: String,
//   },
// });
// const School = mongoose.model("Account", accountSchema);

// export default School;

import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  motto: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  phonetwo: {
    type: String,
  },
  currency: {
    type: String,
  },
  email: {
    type: String,
  },
  sessionStart: {
    type: String,
  },
  sessionEnd: {
    type: String,
  },
  schoolLogo: {
    type: String,
  },
});

const Account = mongoose.model("Account", accountSchema); // Change "School" to "Account"

export default Account;
