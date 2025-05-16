const { createRecipe } = require("../models/recipeDynamo"); 
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "recipe_images",
    format: async () => "png",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage });

const addRecipe = async (event) => {
  try {
    // Parse multipart/form-data to get fields and file info
    // For AWS Lambda, you'll need to use a package like 'busboy' or
    // configure API Gateway to pass form data correctly.
    // But if using Render or Express, multer will handle it.

    // Assuming event.body is JSON string with all fields except image
    // and the file is handled by multer before this function

    // For example purpose, let's assume you receive fields in event.body
    // and file info in event.file (adjust as per your setup)

    const { title, ingredients, instructions, time, userEmail } = JSON.parse(event.body);

    if (!title || !ingredients || !instructions || !time) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Required fields cannot be empty!" }),
      };
    }

    if (!event.file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Recipe image is required!" }),
      };
    }

    const ingredientsArray = JSON.parse(ingredients);
    const imagePath = event.file.path; // from Cloudinary upload

    const newRecipe = {
      id: uuidv4(),
      title,
      ingredients: ingredientsArray,
      instructions,
      time,
      coverImage: imagePath,
      createdBy: userEmail,
    };

    await createRecipe(newRecipe);

    return {
      statusCode: 201,
      body: JSON.stringify(newRecipe),
    };
  } catch (error) {
    console.error("Error adding recipe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error: error.message }),
    };
  }
};

module.exports = { addRecipe, upload };
