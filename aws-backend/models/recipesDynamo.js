const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const docClient = new AWS.DynamoDB.DocumentClient();
const RECIPES_TABLE = "Recipes"; // You can name your DynamoDB table as you wish

// Create/Add new recipe
async function createRecipe(recipe) {
  const params = {
    TableName: RECIPES_TABLE,
    Item: recipe, // recipe should be a JS object with all recipe attributes, including a unique id
  };
  return docClient.put(params).promise();
}

// Get all recipes (scan entire table)
async function getAllRecipes() {
  const params = { TableName: RECIPES_TABLE };
  const data = await docClient.scan(params).promise();
  return data.Items;
}

// Get single recipe by id
async function getRecipeById(id) {
  const params = {
    TableName: RECIPES_TABLE,
    Key: { id }, // id is your primary key for the recipe
  };
  const data = await docClient.get(params).promise();
  return data.Item;
}

// Update recipe by id
async function updateRecipe(id, updateData) {
  // DynamoDB doesn't have partial update in put, so here we'll replace entire item
  // You can first get existing item, merge, then put, or just put updateData as full object
  const params = {
    TableName: RECIPES_TABLE,
    Item: { id, ...updateData },
  };
  return docClient.put(params).promise();
}

// Delete recipe by id
async function deleteRecipe(id) {
  const params = {
    TableName: RECIPES_TABLE,
    Key: { id },
  };
  return docClient.delete(params).promise();
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
