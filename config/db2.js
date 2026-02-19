// /* global process */

// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//       connectTimeoutMS: 15000,
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 120000,
//     });
//     console.log("MongoDB connected.");
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
// /* global process */
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       // ✅ Only keep supported options
//       connectTimeoutMS: 15000,
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 120000,
//     });

//     console.log("MongoDB connected.");
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
// config/db2.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔑 MONGODB_URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 120000,
    });
    console.log("✅ MongoDB connected.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
