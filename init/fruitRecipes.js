const mongoose = require("mongoose");
const FruitRecipe = require("../models/recipeFruit");
const Fruit = require("../models/fruit");

const MONGO_URL = "mongodb://127.0.0.1:27017/RECIPE";

main()
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);

  const xewali = await Fruit.findOne({ name: "Banana" });
  const leteku = await Fruit.findOne({ name: "Mango" });

  if (!Banana || !Mango) {
    console.error("❌ Required fruits not found. Please add 'Xewali' and 'Leteku' first.");
    return;
  }

  const fruitRecipes = [
    {
      title: "XEWALI PAAT BHAJI",
      image: "/images/xewali/recipe.jpg",
      ingredients: [
        { name: "Xewali Leaves", image: "/images/xewali/leaves.jpg" },
        { name: "Mustard Oil", image: "/images/common/mustardOil.jpg" },
        { name: "Garlic", image: "/images/common/garlic.jpg" },
        { name: "Salt", image: "/images/common/salt.jpg" }
      ],
      steps: [
        "Heat mustard oil in a pan.",
        "Add crushed garlic and sauté.",
        "Add Xewali leaves and cook till wilted.",
        "Add salt to taste and serve with rice."
      ],
      nutrition: {
        calories: "90 kcal",
        carbohydrates: "6g",
        protein: "2g",
        fats: "5g",
        fibre: "2g"
      },
      fruitDetails: {
        scientificName: "Nyctanthes arbor-tristis",
        region: "Assam and Northeast India, commonly found in gardens",
        medicinalValue: "Used in Ayurveda for anti-inflammatory and liver health",
        chemicalComposition: "Flavonoids, essential oils, glycosides",
        traditionalUses: "Leaves used in stir-fry, flowers for religious purposes and decoctions"
      },
      fruit: xewali._id
    },

    {
      title: "LETEKU JAM",
      image: "/images/leteku/recipe.jpg",
      ingredients: [
        { name: "Leteku (Dillenia indica)", image: "/images/leteku/fruit.jpg" },
        { name: "Sugar", image: "/images/common/sugar.jpg" },
        { name: "Black Salt", image: "/images/common/blackSalt.jpg" },
        { name: "Chili Powder", image: "/images/common/chili.jpg" }
      ],
      steps: [
        "Peel and deseed Leteku fruits.",
        "Cook pulp with sugar until thick.",
        "Add black salt and chili for taste.",
        "Cool and store in a jar."
      ],
      nutrition: {
        calories: "140 kcal",
        carbohydrates: "35g",
        protein: "1g",
        fats: "0.2g",
        fibre: "3g"
      },
      fruitDetails: {
        scientificName: "Dillenia indica",
        region: "Swampy areas of Assam and Bengal",
        medicinalValue: "Used for digestive issues and throat infections",
        chemicalComposition: "Vitamin C, tannins, phenols, dietary fiber",
        traditionalUses: "Preserved as jam or chutney, used for cooling effect"
      },
      fruit: leteku._id
    }
  ];

  await FruitRecipe.deleteMany({});
  await FruitRecipe.insertMany(fruitRecipes);

  console.log("✅ Fruit recipes seeded successfully.");
  mongoose.connection.close();
}
