const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root route
app.get("/", (req, res) => {
  res.send("The server is working fine!");
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
