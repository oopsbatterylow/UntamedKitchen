// models/fruit.js
const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
  name: String,
  scientificName: String,
  region: String,
  medicinalValue: String,
  chemicalComposition: String,
  traditionalUses: String,
  image: String
});

module.exports = mongoose.model("Fruit", fruitSchema);
