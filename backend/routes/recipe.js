const express = require("express");
const {
    getRecipes,
    getRecipe,
    addRecipe,
    editRecipe,
    deleteRecipe,
    upload
} = require("../controller/recipecon");

const verifytoken = require("../middleware/auth");
const router = express.Router();

// Middleware to set CORS headers for all responses in this route
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://food-recipe-hub.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

router.get("/", getRecipes); // Get all recipes
router.get("/:id", getRecipe); // Get recipe by ID
router.post("/", upload.single("file"), verifytoken, addRecipe); // Add recipe with image
router.put("/:id", upload.single("file"), editRecipe); // Edit recipe
router.delete("/:id", deleteRecipe); // Delete recipe

module.exports = router;
