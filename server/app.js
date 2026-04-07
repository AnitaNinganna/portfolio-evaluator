const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/profile", profileRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Server running
});
