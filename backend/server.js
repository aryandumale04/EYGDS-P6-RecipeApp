require("dotenv").config();
const express = require("express");

const connectDb = require("./config/connectionDB");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
connectDb();

// ✅ Dynamic CORS Fix


const allowedOrigins = [
  "http://localhost:5173",
  "https://food-recipe-hub.vercel.app",
  "http://food-recipe-hub-frontend.s3-website.ap-south-1.amazonaws.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("🛰️ Incoming origin:", origin);

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); // dynamically set!
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});






// ✅ Ensure `public/images` directory exists
const uploadPath = path.join(__dirname, "public", "images");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// ✅ Global Error Handler for Debugging
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.toString() });
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at: ${PORT}`);
});
