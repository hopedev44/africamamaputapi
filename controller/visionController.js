import Vision from "../models/visionModel.js";
import cloudinary from "cloudinary";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import multer from "multer";
import mongoose from "mongoose";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import Dream from "../models/DreamModel.js";
// dotenv.config();

dotenv.config();

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  requestHandler: new NodeHttpHandler({
    requestTimeout: 120000, // 2 minutes timeout
    connectionTimeout: 120000, // 2 minutes connection timeout
  }),
});

// Set up multer with multer-s3 for direct S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "eduprosolution",
    acl: "private", // Set access control list for the uploaded file
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type
    key: (req, file, cb) => {
      const fileKey = `visions/${Date.now()}-${file.originalname}`; // Unique filename
      cb(null, fileKey); // Upload to "visions" folder in the S3 bucket
    },
  }),
});

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_KEY,
//   api_secret: process.env.CLOUD_KEY_SECRET,
// });

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Define your directory where the file will be saved temporarily
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Use a unique filename for each upload
//   },
// });

// const upload = multer({ storage: storage });

// Cloudinary upload handler function
// export const createVision = async (req, res) => {
//   const { title, affirmation, statement, visibility } = req.body;
//   const { userId } = req.user; // Assuming you're using JWT authentication to get the user ID

//   try {
//     let imageUrl = "";

//     // Handle image upload to Cloudinary (only if file is sent)
//     if (req.file) {
//       // Check if the file is received via multer
//       const result = await cloudinary.v2.uploader.upload(req.file.path, {
//         // Use multer's temporary file path
//         folder: "visions",
//         use_filename: true,
//       });
//       imageUrl = result.secure_url; // Cloudinary URL for the image
//     } else {
//       console.log("No image uploaded");
//     }

//     // Save Vision to Database
//     const vision = new Vision({
//       title,
//       affirmation,
//       statement,
//       visibility,
//       imageUrl,
//       userId,
//     });

//     await vision.save();

//     res.status(201).json({
//       message: "Vision created successfully",
//       vision,
//     });
//   } catch (error) {
//     console.error("Error creating vision:", error);
//     res.status(500).json({
//       message: "Failed to create vision",
//     });
//   }
// };

export const createVision = async (req, res) => {
  const { title, affirmation, statement, visibility } = req.body;
  const userId = req.user?._id; // Correct extraction

  try {
    let imageUrl = "";

    // Handle image upload to AWS S3 (only if file is sent)
    if (req.file) {
      imageUrl = req.file.location; // S3 URL of the uploaded file
    } else {
      console.log("No image uploaded");
    }

    // Save Vision to Database
    const vision = new Vision({
      title,
      affirmation,
      statement,
      visibility,
      imageUrl,
      userId,
    });

    await vision.save();

    res.status(201).json({
      message: "Vision created successfully",
      vision,
    });
  } catch (error) {
    console.error("Error creating vision:", error);
    res.status(500).json({
      message: "Failed to create vision",
    });
  }
};
// Get all visions
// export const getAllVisions = async (req, res) => {
//   try {
//     const visions = await Vision.find();
//     res.status(200).json(visions);
//   } catch (error) {
//     console.error("Error fetching visions:", error);
//     res.status(500).json({
//       message: "Failed to fetch visions",
//     });
//   }
// };

// export const getAllVisions = async (req, res) => {
//   try {
//     // Ensure the user's ID is present from the authentication middleware
//     const userId = req.user.userId;

//     // Convert the userId to ObjectId to match the stored userId in the database
//     const objectIdUserId = mongoose.Types.ObjectId(userId);

//     // Fetch visions created by this user
//     const visions = await Vision.find({ createdBy: objectIdUserId });

//     res.status(200).json(visions);
//   } catch (error) {
//     console.error("Error fetching visions:", error);
//     res.status(500).json({
//       message: "Failed to fetch visions",
//     });
//   }
// };

// export const MovetoBoard = async (req, res) => {
//   try {
//     const vision = await Vision.findById(req.params.id);
//     if (!vision) {
//       return res.status(404).json({ message: "Vision not found" });
//     }

//     // Update the vision to mark it as moved to board
//     vision.board = true;
//     await vision.save();

//     res.status(200).json({ message: "Vision moved to board", vision });
//   } catch (error) {
//     console.error("Error moving vision:", error);
//     res.status(500).json({ message: "Failed to move vision" });
//   }
// };

export const MovetoBoard = async (req, res) => {
  try {
    const vision = await Vision.findById(req.params.id);
    if (!vision) {
      return res.status(404).json({ message: "Vision not found" });
    }

    // Check if the request contains a valid "board" status
    if (typeof req.body.board !== "boolean") {
      return res.status(400).json({ message: "Invalid board status" });
    }

    // Update the board status based on request
    vision.board = req.body.board;
    await vision.save();

    res.status(200).json({
      message: `Vision ${vision.board ? "moved to" : "removed from"} board`,
      vision,
    });
  } catch (error) {
    console.error("Error updating vision board status:", error);
    res.status(500).json({ message: "Failed to update vision board status" });
  }
};

export const MovetoBoardTemplate = async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream) {
      return res.status(404).json({ message: "dream not found" });
    }

    // Update the vision to mark it as moved to board
    dream.board = true;
    await dream.save();

    res.status(200).json({ message: "dream moved to board", dream });
  } catch (error) {
    console.error("Error moving dream:", error);
    res.status(500).json({ message: "Failed to move dream" });
  }
};

export const getAllVisions = async (req, res) => {
  try {
    // Get the userId from the authentication middleware (JWT token)
    // const userId = req.user.userId;
    const userId = req.user._id;
    console.log("Fetching visions for userId:", userId);

    // Fetch visions created by this user
    const visions = await Vision.find({ userId: userId, board: false });

    // Check if any visions are returned
    if (visions.length === 0) {
      console.log("No visions found for userId:", userId);
    } else {
      console.log("Visions fetched:", visions);
    }

    // Return the fetched visions
    res.status(200).json(visions);
  } catch (error) {
    console.error("Error fetching visions:", error);
    res.status(500).json({
      message: "Failed to fetch visions",
    });
  }
};
export const getAllBoardVision = async (req, res) => {
  try {
    // Get the userId from the authentication middleware (JWT token)
    // const userId = req.user.userId;
    const userId = req.user._id;
    console.log("Fetching visions for userId:", userId);

    // Fetch visions created by this user
    const visions = await Vision.find({ userId: userId, board: true });

    // Check if any visions are returned
    if (visions.length === 0) {
      console.log("No visions found for userId:", userId);
    } else {
      console.log("Visions fetched:", visions);
    }

    // Return the fetched visions
    res.status(200).json(visions);
  } catch (error) {
    console.error("Error fetching visions:", error);
    res.status(500).json({
      message: "Failed to fetch visions",
    });
  }
};
// Get a single vision
export const getSingleVision = async (req, res) => {
  const { id } = req.params;

  try {
    const vision = await Vision.findById(id);
    if (!vision) {
      return res.status(404).json({ message: "Vision not found" });
    }
    res.status(200).json(vision);
  } catch (error) {
    console.error("Error fetching vision:", error);
    res.status(500).json({
      message: "Failed to fetch vision",
    });
  }
};
export const getSingleVisionByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const vision = await Dream.findOne({ title }); // Fetch vision by title
    if (!vision) {
      return res.status(404).json({ message: "Vision not found" });
    }
    res.status(200).json(vision);
  } catch (error) {
    console.error("Error fetching vision by title:", error);
    res.status(500).json({
      message: "Failed to fetch vision by title",
      error: error.message,
    });
  }
};

export const editVision = async (req, res) => {
  const { id } = req.params; // Get the Vision ID from the request params
  const { title, affirmation, statement, visibility } = req.body; // Get updated data from the request body
  const { _id } = req.user;
  const userId = _id; // Assign _id to userId
  console.log("req.user:", req.user);
  console.log("Extracted userId:", userId);

  try {
    // Find the Vision by ID and check ownership
    const vision = await Vision.findOne({ _id: id, userId });
    if (!vision) {
      return res
        .status(404)
        .json({ message: "Vision not found or unauthorized" });
    }

    // Update fields if provided
    if (title) vision.title = title;
    if (affirmation) vision.affirmation = affirmation;
    if (statement) vision.statement = statement;
    if (visibility) vision.visibility = visibility;

    // Handle image upload if a new image is provided
    if (req.file) {
      vision.imageUrl = req.file.location; // Update the image URL with the new file
    }

    await vision.save();

    res.status(200).json({ message: "Vision updated successfully", vision });
  } catch (error) {
    console.error("Error updating vision:", error);
    res.status(500).json({ message: "Failed to update vision" });
  }
};

export const deleteVision = async (req, res) => {
  const { id } = req.params; // Get the Vision ID from the request params
  const { userId } = req.user; // Assuming you're using JWT authentication

  try {
    // Find the Vision by ID and check ownership
    const vision = await Vision.findOne({ _id: id, userId });
    if (!vision) {
      return res
        .status(404)
        .json({ message: "Vision not found or unauthorized" });
    }

    // Delete Vision from the database
    await Vision.deleteOne({ _id: id });

    res.status(200).json({ message: "Vision deleted successfully" });
  } catch (error) {
    console.error("Error deleting vision:", error);
    res.status(500).json({ message: "Failed to delete vision" });
  }
};
