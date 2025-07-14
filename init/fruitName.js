// init/seedFruits.js
const mongoose = require("mongoose");
const Fruit = require("../models/fruit");

const MONGO_URL = "mongodb://127.0.0.1:27017/RECIPE";

const fruits = [
  { name: "Banana", image: "/uploads/banana.jpg" },
  { name: "Mango", image: "/uploads/mango.jpg" },
  { name: "Guava", image: "/uploads/guava.jpg" },
  { name: "Pineapple", image: "/uploads/pineapple.jpg" },
  { name: "Papaya", image: "/uploads/papaya.jpg" }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URL);
    await Fruit.deleteMany({});
    await Fruit.insertMany(fruits);
    console.log("✅ Fruits seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.log("❌ Error seeding fruits:", err);
  }
}

seedDB();
