// recipe/init/plantNameSave.js

const mongoose = require("mongoose");
const Plant = require("../models/plant"); 
const plantData = require("./plantName");     // your updated correct data

const MONGO_URL = "mongodb://127.0.0.1:27017/RECIPE";

main()
  .then(() => {
    console.log("🌱 Connected to DB");
  })
  .catch((err) => {
    console.error("❌ Error connecting:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);

  // ✅ Delete all previous records before inserting
  await Plant.deleteMany({});
  console.log("🗑️ Old data deleted");

  // ✅ Insert new data
  await Plant.insertMany(plantData);
  console.log("✅ New plant data inserted");

  mongoose.connection.close();
}
