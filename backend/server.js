const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDB");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 5000;
connectDb();

// Ensure `public/images` exists (using absolute path for deployment)
const uploadPath = path.join(__dirname, "public", "images");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(express.json());

// ✅ Properly configure CORS
const allowedOrigins = ["https://food-recipe-hub.vercel.app"]; // Frontend URL
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true // Allow cookies and authentication
}));

app.use(express.static("public")); // Keeping your existing static file serving

// Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
});
