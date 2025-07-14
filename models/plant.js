// models/plant.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plantSchema = new Schema({
  name: String,
  scientificName: String,
  region: String,
  medicinalValue: String,
  chemicalComposition: String,
  traditionalUses: String,
  image: String
});

module.exports = mongoose.model("Plant", plantSchema);
