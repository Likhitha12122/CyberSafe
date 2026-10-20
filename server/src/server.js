
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import incidentRoutes from "./routes/incidents.js";
import urlScanRoutes from "./routes/urlScan.js";
import quizRoutes from "./routes/quizzes.js";
import learningRoutes from "./routes/learning.js";

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

// Parse JSON requests
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CyberSafe server is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Incident reporting routes
app.use("/api/incidents", incidentRoutes);

// URL scanning routes
app.use("/api/url", urlScanRoutes);

// Cybersecurity quiz routes
app.use("/api/quizzes", quizRoutes);

app.use("/api/learning", learningRoutes);

// MongoDB connection and server startup
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
