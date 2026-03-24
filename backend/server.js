import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import leaveRoutes from "./routes/leave.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Root Route (to check if server works)
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check route (optional but useful)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server running successfully" });
});

// Render requires dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});