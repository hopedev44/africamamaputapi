import express from "express";
import passport from "passport"; // No need to import passport.js directly

import {
  signUp,
  login,
  forgotPassword,
  getProfile,
  refreshToken,
} from "../controller/authController.js";
import { protect } from "../middleware/protectUser.js";
import User from "../models/userModel.js";
import { generateJWT, generateRefreshToken } from "../utils/jwt.js";
// const { resetDto } = require('../validators/resetPassword')
// const authRouter = express.Router()
const router = express.Router();
// authRouter.route('/signup').post(signupDto, signUp)

// authRouter.route('/reset/password').post(resetDto, resetPassword)

// router.post('/login', signin);
router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.post("/auth/refresh-token", refreshToken);

// Google login route - redirects to Google OAuth for authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google callback route - called after Google OAuth is successful
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     const token = req.user.accessToken;
//     const refreshToken = req.user.refreshToken;
//     // Redirect user to a page with the access and refresh tokens
//     res.redirect(`/vision?accessToken=${token}&refreshToken=${refreshToken}`);
//   }
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   async (req, res) => {
//     const googleEmail = req.user.email;

//     try {
//       let user = await User.findOne({ email: googleEmail });

//       if (!user) {
//         user = new User({
//           email: googleEmail,
//           name: req.user.name,
//           googleId: req.user.id,
//         });
//         await user.save();
//       }

//       const token = generateJWT(user);
//       const refreshToken = generateRefreshToken(user);

//       // Store the tokens in localStorage (in your frontend code)
//       // res.redirect(
//       //   `http://localhost:3001/vision?accessToken=${token}&refreshToken=${refreshToken}`
//       // );
//       res.redirect(
//         `http://localhost:3001/vision?accessToken=${encodeURIComponent(
//           token
//         )}&refreshToken=${encodeURIComponent(refreshToken)}`
//       );
//     } catch (error) {
//       console.error("Error during Google login:", error);
//       res.redirect("/login");
//     }
//   }
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   async (req, res) => {
//     const googleEmail = req.user.email;

//     try {
//       let user = await User.findOne({ email: googleEmail });

//       if (!user) {
//         user = new User({
//           email: googleEmail,
//           name: req.user.name,
//           googleId: req.user.id,
//         });
//         await user.save();
//       }

//       const token = generateJWT(user);
//       const refreshToken = generateRefreshToken(user);

//       // Redirecting user to frontend with tokens in query params
//       res.redirect(
//         `http://localhost:3001/vision?accessToken=${encodeURIComponent(
//           token
//         )}&refreshToken=${encodeURIComponent(refreshToken)}`
//       );
//     } catch (error) {
//       console.error("Error during Google login:", error);
//       res.redirect("/login");
//     }
//   }
// );
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const googleEmail = req.user.email;

    try {
      console.log("Google authentication successful for email:", googleEmail);

      let user = await User.findOne({ email: googleEmail });

      if (!user) {
        user = new User({
          email: googleEmail,
          name: req.user.name,
          googleId: req.user.id,
        });
        await user.save();
        console.log("New user created:", user);
      }

      const token = generateJWT(user);
      const refreshToken = generateRefreshToken(user);

      // Log the tokens to ensure they are being generated properly

      // Redirecting user to frontend with tokens in query params
      const redirectUrl = `https://lifemirrordashboard.vercel.app/home?accessToken=${encodeURIComponent(
        token
      )}&refreshToken=${encodeURIComponent(refreshToken)}`;

      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error during Google login:", error);
      res.redirect("/login");
    }
  }
);

router.get("/profile", protect, getProfile); // New route for fetching profile
router.put("/forgotpassword", forgotPassword);
router.post("/forgotpassword", forgotPassword);
// router.post('/sendpasswordlink', forgotLink)
//  authRouter
//  .route('/reset/password')
//  .post(resetDto, resetPassword);

export default router;
