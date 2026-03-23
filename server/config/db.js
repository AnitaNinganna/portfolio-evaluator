const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("MongoDB URI not set; skipping database connection for local dev.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    // don't crash entire server for API dev path
  }
};

module.exports = connectDB;