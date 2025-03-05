const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDB");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
connectDb();

// ✅ Dynamic CORS Fix
app.use((req, res, next) => {
    const allowedOrigins = [
        "https://food-recipe-hub.vercel.app",
        "http://localhost:5173"  // ✅ Allow local frontend
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
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
app.use(express.static("public"));

// ✅ Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// ✅ Start server
app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`);
});
