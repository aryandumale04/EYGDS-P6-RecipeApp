const Recipes = require("../models/recipeschema");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images"); // Save files in public/images
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original filename
    }
});


const upload = multer({ storage });

const addRecipe = async (req, res) => {
    console.log(req.user)
    try {
        const { title, ingredients, instructions, time } = req.body;

        if (!title || !ingredients || !instructions || !time) {
            return res.status(400).json({ message: "Required fields cannot be empty!" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Recipe image is required!" });
        }

        const ingredientsArray = JSON.parse(ingredients);

        // Store full image URL instead of relative path
        const imagePath = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        console.log("File Upload Details:", JSON.stringify(req.file, null, 2));

        const newRecipe = await Recipes.create({
            title,
            ingredients: ingredientsArray,
            instructions,
            time,
            coverImage: imagePath , // Store full URL
            createdBy:req.user.id
        });

        return res.status(201).json(newRecipe);
    } catch (error) {
        console.error("Error adding recipe:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getRecipes = async (req, res) => {
   const recipes = await Recipes.find();
   return res.json(recipes);
};

const getRecipe = async (req, res) => {
    const recipe = await Recipes.findById(req.params.id);
    res.json(recipe);
};

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
            imagePath = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        }

        // Convert ingredients back to an array
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


const deleteRecipe = async (req, res) => {
    try {
        await Recipes.findByIdAndDelete(req.params.id);
        res.json({ message: "Recipe deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting recipe!" });
    }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
