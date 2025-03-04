const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDB");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
connectDb();

// ✅ CORS Configuration
const allowedOrigins = ["https://food-recipe-hub.vercel.app"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Ensure `public/images` directory exists
const uploadPath = path.join(__dirname, "public", "images");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(express.json());
app.use(express.static("public"));

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
