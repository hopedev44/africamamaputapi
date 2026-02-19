import School from "../models/School.js";

// export const createSchool = async (req, res, next) => {
//   try {
//     const newUser = new School(req.body);
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const createSchool = async (req, res) => {
  try {
    const school = new School(req.body);
    console.log("Received data:", req.body); // Add this line for debugging
    await school.save();
    res.status(201).json({ message: "School registered successfully" });
  } catch (err) {
    console.error("Error registering school:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
