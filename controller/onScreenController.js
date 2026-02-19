/* global process */
/* global Buffer */

import Script from "../models/onScreenModel.js";
import { Readable } from "stream";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Create an S3Client instance with your credentials and region
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

export const uploadAndMarkAnswerScripts = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Retrieve necessary data from request body
    const { className, subject, saleName } = req.body;
    console.log("Received request body:", req.body);

    // Create a new instance of the Script model
    const answerScript = new Script({
      className,
      subject,
      saleName,
      answerScriptFiles: req.files.map((file) => file.originalname),
    });

    // Save the instance to the database
    await answerScript.save();

    // Process the uploaded answer script file(s)
    const answerScriptFiles = req.files;

    console.log("Uploaded files:", answerScriptFiles);

    // Check if answerScriptFiles is properly populated
    if (!Array.isArray(answerScriptFiles)) {
      console.error(
        "Error: answerScriptFiles is not an array or is undefined."
      );
      res.status(400).json({ error: "Invalid answerScriptFiles" });
      return; // Exit the function early
    }
    console.log("Uploaded files:", answerScriptFiles);

    // Example: Save answer script files to S3
    const uploadPromises = answerScriptFiles.map(async (file) => {
      const uploadParams = {
        Bucket: "edupros", // Replace with your AWS S3 bucket name
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      if (!Buffer.isBuffer(file.buffer)) {
        console.error("Error: file buffer is not a Buffer object");
        return; // Exit the function early
      }
      // Convert file buffer to a readable stream
      const stream = Readable.from(file.buffer);

      // Update uploadParams with the correct Body value
      uploadParams.Body = stream;

      // Create a PutObjectCommand
      const command = new PutObjectCommand(uploadParams);

      // Execute the PutObjectCommand
      const result = await s3.send(command);

      console.log("S3 Upload Result:", result);

      if (result && result.Location) {
        console.log("File uploaded successfully to:", result.Location);
        return result.Location;
      } else {
        console.error("Error uploading file to S3:", result);
      }
    });

    await Promise.all(uploadPromises);

    // Return success message
    res.status(200).json({ message: "Answer scripts uploaded successfully" });
  } catch (error) {
    console.error("Error uploading answer scripts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Define the controller function
export const getByClassNameSaleAndSubject = async (req, res) => {
  try {
    const { className, saleName, subject } = req.params;
    console.log("Received parameters:", className, saleName, subject);

    // Query the database to retrieve data based on provided parameters
    const data = await Script.find({ className, saleName, subject });
    console.log("Retrieved data:", data);

    // Return the retrieved data in the response
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const createSetting = async (req, res) => {
//   try {
//     const { name, principalName, resumptionDate } = req.body;

//     // Check if school profile exists, create if not
//     let school = await Setting.findOne();
//     if (!school) {
//       school = new Setting();
//     }

//     school.name = name;
//     school.principalName = principalName;
//     school.resumptionDate = resumptionDate;

//     // Handle file upload if a signature file is provided
//     if (req.file) {
//       school.signature = req.file.filename;
//     }

//     await school.save();

//     res
//       .status(200)
//       .json({ success: true, message: "School profile updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const getSetting = async (req, res) => {
//   try {
//     // Assuming you only have one school profile, you can fetch the first one
//     const schoolSetting = await Setting.findOne();

//     if (!schoolSetting) {
//       return res
//         .status(404)
//         .json({ success: false, message: "School setting not found" });
//     }

//     res.status(200).json({ success: true, data: schoolSetting });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
// export const getAccountSetting = async (req, res) => {
//   try {
//     // Assuming you only have one school profile, you can fetch the first one
//     const schoolSetting = await Account.findOne();

//     if (!schoolSetting) {
//       return res
//         .status(404)
//         .json({ success: false, message: "School setting not found" });
//     }

//     res.status(200).json({ success: true, data: schoolSetting });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const createAccount = async (req, res, s3) => {
//   try {
//     const {
//       name,
//       motto,
//       address,
//       phone,
//       phonetwo,
//       currency,
//       email,
//       sessionStart,
//       sessionEnd,
//     } = req.body;

//     console.log("Received request body:", req.body);

//     // Check if school profile exists, create if not
//     let school = await Account.findOne();
//     if (!school) {
//       school = new Account();
//     }

//     school.name = name;
//     school.motto = motto;
//     school.address = address;
//     school.phone = phone;
//     school.phonetwo = phonetwo;
//     school.currency = currency;
//     school.email = email;
//     school.sessionStart = sessionStart;
//     school.sessionEnd = sessionEnd;

//     if (req.file) {
//       console.log("Received file:", req.file);

//       // Add this function to handle the actual S3 upload
//       const uploadParams = {
//         Bucket: "edupros", // Replace with your bucket name
//         Key: `${Date.now()}-${req.file.originalname}`,
//         Body: req.file.buffer,
//         ACL: "public-read",
//         ContentType: req.file.mimetype,
//       };

//       console.log("Upload Parameters:", uploadParams);

//       // Use the putObject method
//       const result = await s3.putObject(uploadParams);
//       console.log("S3 Upload Result:", result);

//       console.log("File uploaded successfully:", result.Location);
//       if (result && result.ETag) {
//         school.schoolLogo = uploadParams.Key;
//         console.log("File URL:", school.schoolLogo);
//       } else {
//         console.error("Error uploading file to S3:", result);
//       }
//     }

//     await school.save();
//     console.log("Updated School Profile:", school);

//     // Add this console log to see the data in the database
//     const updatedSchool = await Account.findOne();
//     console.log("Data in the database:", updatedSchool);

//     res
//       .status(200)
//       .json({ success: true, message: "School profile updated successfully" });
//   } catch (error) {
//     console.error("Error updating school profile:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
