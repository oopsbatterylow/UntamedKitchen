const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: String,
  image: String // optional
});

const nutritionSchema = new Schema({
  calories: String,
  carbohydrates: String,
  protein: String,
  fats: String,
  fibre: String
});

const fruitDetailsSchema = new Schema({
  scientificName: String,
  region: String,
  medicinalValue: String,
  chemicalComposition: String,
  traditionalUses: String
});

const fruitRecipeSchema = new Schema({
  title: String,                      // Recipe title
  image: String,                      // Main image
  ingredients: [ingredientSchema],   // Ingredient array with optional image
  steps: [String],                   // Array of instructions
  nutrition: nutritionSchema,        // Nutrition facts
  fruitDetails: fruitDetailsSchema,  // Metadata about the fruit used
  fruit: {
    type: Schema.Types.ObjectId,
    ref: "Fruit"
  }
});

module.exports = mongoose.model("FruitRecipe", fruitRecipeSchema);
