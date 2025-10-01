const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/Mongodb");
const connectcloudinary = require("./config/cloudinary");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database + Cloudinary
connectDB();
connectcloudinary();

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

// Test route
app.get("/health", (req, res) => {
  res.send("The server is working fine!");
});

// IMPORTANT: Use Railway's injected PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
