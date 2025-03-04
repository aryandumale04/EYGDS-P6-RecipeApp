const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDb = require("./config/connectionDB");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
connectDb();

// Ensure `public/images` exists
const uploadPath = path.join(__dirname, "public", "images");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Middleware
app.use(express.json());

// ✅ Updated CORS to allow frontend access
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*", // Allow frontend URL or all origins
        credentials: true,
    })
);

// ✅ Ensure static files are served properly
app.use("/public", express.static(path.join(__dirname, "public")));

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Routes
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});
