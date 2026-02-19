import Book from "../models/bookModel.js";

// export const createBook = async (req, res, s3) => {
//   try {
//     const { category, price, title, desc, authorName, language } = req.body;

//     console.log("Received request body:", req.body);

//     // Create a new instance of Download model
//     const newDownload = new Book({
//       category,
//       price,
//       title,
//       desc,
//       authorName,
//       language,
//     });

//     if (req.file) {
//       console.log("Received file:", req.file);

//       // Generate a unique filename
//       const fileName = `${Date.now()}-${req.file.originalname}`;

//       const uploadParams = {
//         Bucket: "edupros", // Replace with your bucket name
//         Key: fileName, // Use the generated filename
//         Body: req.file.buffer,
//         ACL: "public-read",
//         ContentType: req.file.mimetype,
//       };

//       console.log("Upload Parameters:", uploadParams);

//       // Use the putObject method to upload the file to S3
//       const result = await s3.putObject(uploadParams);
//       console.log("S3 Upload Result:", result);

//       console.log("File uploaded successfully:", result.Location);

//       // Save the filename to the newDownload object
//       newDownload.Download = fileName;
//     }

//     // Save the newDownload object to the database
//     const savedDownload = await newDownload.save();
//     console.log("Saved Download:", savedDownload);

//     res
//       .status(200)
//       .json({ success: true, message: "File uploaded successfully" });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
export const createBook = async (req, res, s3) => {
  try {
    const {
      category,
      genprice,
      ourprice,
      title,
      desc,
      status,
      authorName,
      language,
      format,
      pages,
      dimensions,
      pubDate,
      ISBN,
      Reviews,
      AboutAuthor,
      AuthorSince,
    } = req.body;

    console.log("Received request body:", req.body);

    // Create a new instance of Book model
    const newBook = new Book({
      category,
      genprice,
      ourprice,
      title,
      desc,
      status,
      authorName,
      language,
      format,
      pages,
      dimensions,
      pubDate,
      ISBN,
      Reviews,
      AboutAuthor,
      AuthorSince,
    });

    if (req.files) {
      console.log("Received files:", req.files);

      // Upload image file
      if (req.files.imageUrl) {
        const imageFiles = req.files.imageUrl[0];
        const imageFilesName = `${Date.now()}-${imageFiles.originalname}`;

        const imageUploadParams = {
          Bucket: "edupros",
          Key: imageFilesName,
          Body: imageFiles.buffer,
          ACL: "public-read",
          ContentType: imageFiles.mimetype,
        };

        const imageUploadResult = await s3.putObject(imageUploadParams);
        console.log("Image uploaded successfully:", imageUploadResult);

        // Assign imageUrl property to newBook
        newBook.imageUrl = imageUploadParams.Key;
      }

      // Upload book file
      if (req.files.Download) {
        const bookFile = req.files.Download[0];
        const bookFileName = `${Date.now()}-${bookFile.originalname}`;

        const bookUploadParams = {
          Bucket: "edupros",
          Key: bookFileName,
          Body: bookFile.buffer,
          ACL: "public-read",
          ContentType: bookFile.mimetype,
        };

        const bookUploadResult = await s3.putObject(bookUploadParams);
        console.log("Book uploaded successfully:", bookUploadResult);

        // Assign Download property to newBook
        newBook.Download = bookUploadParams.Key;
      }
    }

    console.log("New Book object:", newBook); // Log newBook object before saving

    // Save the newBook object to the database
    const savedBook = await newBook.save();
    console.log("Saved Book:", savedBook);

    // Include file URLs in the response
    const fileUrls = {
      imageUrl: newBook.imageUrl || null,
      bookUrl: newBook.Download || null,
    };

    res
      .status(200)
      .json({ success: true, message: "Book uploaded successfully", fileUrls });
  } catch (error) {
    console.error("Error uploading book:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBook = async (req, res) => {
  try {
    const books = await Book.find().select(
      "title desc status category authorName language imageUrl Download genprice ourprice  format pages dimensions pubDate ISBN Reviews AboutAuthor AuthorSince"
    );

    if (!books) {
      return res
        .status(404)
        .json({ success: false, message: "Books not found" });
    }

    res.status(200).json({ success: true, data: books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getBookById = async (req, res) => {
  try {
    // Extract the book ID from the request parameters
    const { id } = req.params;

    // Find the book by its ID
    const book = await Book.findById(id);

    // Check if the book with the specified ID exists
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // If the book is found, return it in the response
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    // If an error occurs, handle it and return an error response
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
