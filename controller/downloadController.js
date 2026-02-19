import Download from "../models/downloadModel.js";

export const createDownload = async (req, res, s3) => {
  try {
    const { date, title, desc, className, subject } = req.body;

    console.log("Received request body:", req.body);

    // Create a new instance of Download model
    const newDownload = new Download({
      date,
      title,
      desc,
      className,
      subject,
    });

    if (req.file) {
      console.log("Received file:", req.file);

      // Generate a unique filename
      const fileName = `${Date.now()}-${req.file.originalname}`;

      const uploadParams = {
        Bucket: "edupros", // Replace with your bucket name
        Key: fileName, // Use the generated filename
        Body: req.file.buffer,
        ACL: "public-read",
        ContentType: req.file.mimetype,
      };

      console.log("Upload Parameters:", uploadParams);

      // Use the putObject method to upload the file to S3
      const result = await s3.putObject(uploadParams);
      console.log("S3 Upload Result:", result);

      console.log("File uploaded successfully:", result.Location);

      // Save the filename to the newDownload object
      newDownload.Downloads = fileName;
    }

    // Save the newDownload object to the database
    const savedDownload = await newDownload.save();
    console.log("Saved Download:", savedDownload);

    res
      .status(200)
      .json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getDownload = async (req, res) => {
  try {
    // Assuming you only have one school profile, you can fetch the first one
    const schoolSetting = await Download.find();

    if (!schoolSetting) {
      return res
        .status(404)
        .json({ success: false, message: "Download not found" });
    }

    res.status(200).json({ success: true, data: schoolSetting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
