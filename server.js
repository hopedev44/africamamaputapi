

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
// import passport from "passport";
// import "./passport.js";

import connectDB from "./config/db2.js";

// Routes
import visionRoutes from "./routes/visionRoutes.js";
import productRoute from "./routes/productRoute.js";
import DbproductRoute from "./routes/DbproductRoute.js";
import brandRoute from "./routes/brandRoute.js";
import DbbrandRoute from "./routes/DbbrandRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import catRoute from "./routes/catRoute.js";
import DbcatRoute from "./routes/DbcatRoute.js";
import authRoute from "./routes/authRoute.js";
import DbauthRoute from "./routes/DbauthRoute.js";
import DbcartRoute from "./routes/DbcartRoute.js";

dotenv.config();

const app = express();
connectDB();

/* -------------------- BODY PARSERS -------------------- */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* -------------------- CORS -------------------- */
const allowedOrigins = [
  "https://admin.rayofaa.com",
  "https://africamamaput.vercel.app",
  "https://www.africanmamaput.co.uk",
  "https://africanmamaput.co.uk",
  "https://admin.africanmamaput.co.uk",
 "https://rayofaa.com",
  "https://www.rayofaa.com",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, cron jobs
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------- NO CACHE -------------------- */
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

/* -------------------- SESSION -------------------- */
app.use(
  session({
    name: "rayofaa.sid",
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60,
    }),
  })
);

/* -------------------- PASSPORT -------------------- */
// app.use(passport.initialize());
// app.use(passport.session());

/* -------------------- ROUTES -------------------- */
app.use("/api", authRoute);
app.use("/api/db", DbauthRoute);

app.use("/api", visionRoutes);
app.use("/api", productRoute);
app.use("/api/db", DbproductRoute);

app.use("/api/payment", paymentRoute);

app.use("/api", catRoute);
app.use("/api/db", DbcatRoute);

app.use("/api", brandRoute);
app.use("/api/db", DbbrandRoute);

app.use("/api/db", DbcartRoute);

/* -------------------- ERROR HANDLER (IMPORTANT) -------------------- */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* -------------------- START -------------------- */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
