const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: String,
  image: String
});

const nutritionSchema = new Schema({
  calories: String,
  carbohydrates: String,
  protein: String,
  fats: String,
  fibre: String,
  sugar: String,
  iron: String,
  vitaminA: String,
  vitaminC: String
});

const recipeSchema = new Schema({
  title: String,
  image: String,
  ingredients: [ingredientSchema],
  steps: [String],
  nutrition: nutritionSchema,
  plant: {
    type: Schema.Types.ObjectId,
    ref: "Plant"
  }
});

module.exports = mongoose.model("Recipe", recipeSchema);
