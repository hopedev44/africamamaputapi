import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_AUTH_REDIRECT_URI
);

export const signUp = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ message: "Fullname, email, and password are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        fullname,
        email,
        password: hashedPassword,
      });

      // Generate JWT tokens
      const token = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { _id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Store tokens in the DB
      user.accessToken = token;
      user.refreshToken = refreshToken;

      await user.save();

      res.status(201).json({
        success: true,
        message: "Registration successful",
        user,
        token: user.accessToken,
        refreshToken: user.refreshToken,
      });
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateJWT(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// export const login = async (req, res, next) => {
//   const { email, password, googleToken } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (googleToken) {
//       const ticket = await oauth2Client.verifyIdToken({
//         idToken: googleToken,
//         audience: process.env.GOOGLE_CLIENT_ID,
//       });
//       const payload = ticket.getPayload();

//       if (user.googleId !== payload.sub) {
//         return res.status(401).json({ message: "Invalid Google token" });
//       }

//       // const token = jwt.sign(
//       //   { id: user._id, isAdmin: user.isAdmin },
//       //   process.env.JWT_SECRET,
//       //   { expiresIn: "1h" }
//       // );
//       const token = jwt.sign(
//         { userId: user._id, isAdmin: user.isAdmin }, // Change `id` to `userId`
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       res.status(200).json({
//         accessToken: user.accessToken,
//         refreshToken: user.refreshToken,
//         token,
//         user,
//       });
//     } else {
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: "Invalid password" });
//       }

//       const token = jwt.sign(
//         { id: user._id, isAdmin: user.isAdmin },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       res.status(200).json({
//         accessToken: user.accessToken,
//         refreshToken: user.refreshToken,
//         token,
//         user,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const login = async (req, res, next) => {
  const { email, password, googleToken } = req.body;
  console.log("Login Request Received:", { email, googleToken });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (googleToken) {
      const ticket = await oauth2Client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (user.googleId !== payload.sub) {
        return res.status(401).json({ message: "Invalid Google token" });
      }
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    // const token = jwt.sign(
    //   { userId: user._id, isAdmin: user.isAdmin },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    console.log("Profile Request Received. User in Request:", req.user);

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found or token invalid" });
    }

    // const user = await User.findById(req.user.userId).select("-password");
    const user = await User.findById(req.user._id).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = (req, res) => {
  // Handle forgot password
  // You can implement email sending logic here
  res.send("Password reset link sent!");
};
