const Recipes = require("../models/recipeschema");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "recipe_images", // Folder name in Cloudinary
        format: async (req, file) => "png", // Convert all images to PNG
        public_id: (req, file) => file.originalname.split(".")[0], // Use filename as public_id
    },
});

const upload = multer({ storage });

// Add Recipe
const addRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, time } = req.body;

        if (!title || !ingredients || !instructions || !time) {
            return res.status(400).json({ message: "Required fields cannot be empty!" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Recipe image is required!" });
        }

        const ingredientsArray = JSON.parse(ingredients);

        // Get Cloudinary URL
        const imagePath = req.file.path;

        const newRecipe = await Recipes.create({
            title,
            ingredients: ingredientsArray,
            instructions,
            time,
            coverImage: imagePath, // Store Cloudinary URL
            createdBy: req.user.id
        });

        return res.status(201).json(newRecipe);
    } catch (error) {
        console.error("Error adding recipe:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get All Recipes
const getRecipes = async (req, res) => {
   const recipes = await Recipes.find();
   return res.json(recipes);
};

// Get Single Recipe
const getRecipe = async (req, res) => {
    const recipe = await Recipes.findById(req.params.id);
    res.json(recipe);
};

// Edit Recipe
const editRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, time } = req.body;

        // Find the existing recipe
        const recipe = await Recipes.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found!" });
        }

        let imagePath = recipe.coverImage; // Keep the old image path if no new image is uploaded

        // If a new image is uploaded, update the imagePath
        if (req.file) {
            imagePath = req.file.path; // New Cloudinary URL
        }

        const ingredientsArray = JSON.parse(ingredients);

        // Update the recipe
        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            { title, ingredients: ingredientsArray, instructions, time, coverImage: imagePath },
            { new: true }
        );

        res.json(updatedRecipe);
    } catch (err) {
        console.error("Error updating recipe:", err);
        res.status(500).json({ message: "Error updating recipe!", error: err.message });
    }
};

// Delete Recipe
const deleteRecipe = async (req, res) => {
    try {
        await Recipes.findByIdAndDelete(req.params.id);
        res.json({ message: "Recipe deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting recipe!" });
    }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
