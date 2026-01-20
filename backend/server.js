require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDb = require("./config/connectionDB");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

const allowedOrigins = [
  "http://localhost:5173",
  "https://food-recipe-hub.vercel.app",
  "http://food-recipe-hub-frontend.s3-website.ap-south-1.amazonaws.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests without origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// explicitly handle preflight
app.options("*", cors());

// Ensure public/images directory exists
const uploadPath = path.join(__dirname, "public", "images");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at: ${PORT}`);
});
