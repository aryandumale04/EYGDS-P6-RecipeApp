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

// ❌ Removed the hardcoded CORS block

router.get("/", getRecipes); // Get all recipes
router.get("/:id", getRecipe); // Get recipe by ID
router.post("/", upload.single("file"), verifytoken, addRecipe); // Add recipe with image
router.put("/:id", upload.single("file"), editRecipe); // Edit recipe
router.delete("/:id", deleteRecipe); // Delete recipe

module.exports = router;
