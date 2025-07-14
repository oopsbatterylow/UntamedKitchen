const mongoose = require("mongoose");
const Recipe = require("../models/recipe");
const Plant = require("../models/plant");

const MONGO_URL = "mongodb://127.0.0.1:27017/RECIPE";

main()
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

async function main() {
  await mongoose.connect(MONGO_URL);

  // Fetching plants from DB
  const plant = await Plant.findOne({ name: "Norohingho" });
  const dhekiaPlant = await Plant.findOne({ name: "Dhekia" });

  // Recipe 1 – Norohingho Dal
  const norohinghoDal = {
    title: "NOROHINGHA DAAL",
    image: "/images/norohingha/recipeImg.jpg",
    ingredients: [
      { name: "Moong Dal", image: "/images/norohingha/moongDal.jpg" },
      { name: "Turmeric", image: "/images/norohingha/termeric.jpg" },
      { name: "Salt", image: "/images/bhedailota/salt.jpg" },
      { name: "Norohingho Leaves", image: "/images/norohingha.jpg" },
      { name: "Ghee", image: "/images/norohingha/ghree.jpg" },
      { name: "Garlic", image: "/images/norohingha/garlic.jpg" }
    ],
    steps: [
      "Boil moong dal with turmeric and salt until soft.",
      "Add chopped Norohingho leaves and simmer for 2–3 minutes.",
      "Add ghee and optional tadka of jeera or garlic.",
      "Serve with soft rice for a healthy meal."
    ],
    nutrition: {
      calories: "200 kcal",
      carbohydrates: "25g",
      protein: "6g",
      fats: "9g",
      fibre: "4g"
    },
    plantDetails: {
      scientificName: "Murraya koenigii",
      region: "Found in Assam, North-East India; thrives in tropical/subtropical zones",
      medicinalValue: "Helps lower blood sugar, reduces inflammation, supports liver health",
      chemicalComposition: "Iron, Calcium, Phosphorus, Vitamins A, B, C, and E",
      traditionalUses: "Used in Ayurvedic medicine for diabetes, skin diseases, and digestion"
    },
    plant: plant._id
  };

  // Recipe 2 – Dhekia Bhaji
  const dhekiaBhaji = {
    title: "DHEKIA BHAJI",
    image: "/images/dhekia/recipeImg.jpg",
    ingredients: [
      { name: "Dhekia Fern", image: "/images/dhekia.jpg" },
      { name: "Mustard Oil", image: "/images/bhedailota/musterd oil.jpg" },
      { name: "Green Chilies", image: "/images/dhekia/salt" },
      { name: "Salt", image: "/images/bhedailota/salt.jpg" }
    ],
    steps: [
      "Wash and chop dhekia ferns.",
      "Heat mustard oil in a pan and add green chilies.",
      "Add dhekia and salt, sauté for 5–6 minutes until tender.",
      "Serve with steamed rice."
    ],
    nutrition: {
      calories: "120 kcal",
      carbohydrates: "15g",
      protein: "3g",
      fats: "5g",
      fibre: "3g"
    },
    plantDetails: {
      scientificName: "Diplazium esculentum",
      region: "Hilly and moist forest regions of Assam",
      medicinalValue: "Rich in antioxidants and iron, helps digestion",
      chemicalComposition: "Iron, potassium, Vitamin C, carotenoids",
      traditionalUses: "Used in Assamese households for its medicinal value and taste"
    },
    plant: dhekiaPlant._id
  };

  // Recipe 3 – Sengmora Gahori
  const SengmoraGahori = {
    title: "PORK WITH SENGMORA XAAK",
    image: "/images/dhekia/recipeImg.jpg",
    ingredients: [
      { name: "Pork", image: "/images/sengmora/pork.jpg" },
      { name: "Mustard Oil", image: "/images/bhedailota/musterd oil.jpg" },
      { name: "Green Chilies", image: "/images/dhekia/salt" },
      { name: "Salt", image: "/images/bhedailota/salt.jpg" }
    ],
    steps: [
      "Wash and marinate pork.",
      "Stir fry with mustard oil, sengmora leaves, and green chilies.",
      "Add salt and simmer until tender.",
      "Serve hot with rice."
    ],
    nutrition: {
      calories: "320 kcal",
      carbohydrates: "10g",
      protein: "15g",
      fats: "25g",
      fibre: "2g"
    },
    plantDetails: {
      scientificName: "Unknown (Sengmora local herb)",
      region: "Assam, tribal forest edges",
      medicinalValue: "Used for body heat regulation and digestion",
      chemicalComposition: "Mostly chlorophyll, alkaloids (unknown)",
      traditionalUses: "Cooked with pork in traditional tribal cuisines"
    },
    plant: dhekiaPlant._id
  };

  // Recipe 4 – Kosu aru Hukloti
  const kosuAruHukloti = {
    title: "KOSU ARU HUKLOTI",
    image: "/images/dhekia/recipeImg.jpg",
    ingredients: [
      { name: "Kosu (Taro)", image: "/images/kosu.jpg" },
      { name: "Hukloti Leaves", image: "/images/hukloti.jpg" },
      { name: "Mustard Oil", image: "/images/bhedailota/musterd oil.jpg" },
      { name: "Salt", image: "/images/bhedailota/salt.jpg" }
    ],
    steps: [
      "Peel and chop kosu.",
      "Boil with hukloti and salt.",
      "Fry mustard oil and mix in.",
      "Serve warm."
    ],
    nutrition: {
      calories: "180 kcal",
      carbohydrates: "30g",
      protein: "2g",
      fats: "4g",
      fibre: "5g"
    },
    plantDetails: {
      scientificName: "Colocasia esculenta & unknown herb",
      region: "River banks and fields in Assam",
      medicinalValue: "Cooling effect, good for stomach issues",
      chemicalComposition: "Starch, iron, fibre, flavonoids",
      traditionalUses: "Used in monsoon diet for gut cleansing"
    },
    plant: dhekiaPlant._id
  };

  // Recipe 5 – Bhedailotar Bor
  const bhedailota = {
    title: "BHEDAILOTAR BOR",
    image: "/images/bhedailota/recipi.png",
    ingredients: [
      { name: "Bhedailota Leaves", image: "/images/bhedailota/bhedailota.jpg" },
      { name: "Boiled Potato", image: "/images/bhedailota/boiledPotato.jpg" },
      { name: "Chopped Onion", image: "/images/bhedailota/choppedonion.jpg" },
      { name: "Mustard Oil", image: "/images/bhedailota/musterd oil.jpg" },
      { name: "Salt", image: "/images/bhedailota/salt.jpg" },
      { name: "Spices", image: "/images/bhedailota/spices.jpg" },
      { name: "Bread Crumbs", image: "/images/bhedailota/breadCrumps.jpg" }
    ],
    steps: [
      "Mash potato with Bhedailota and spices.",
      "Shape into small cutlets or tikkis.",
      "Roll in breadcrumbs and shallow fry.",
      "Serve with ketchup or curd."
    ],
    nutrition: {
      calories: "150 kcal",
      carbohydrates: "17g",
      protein: "2g",
      fats: "6g",
      fibre: "1.5g"
    },
    plantDetails: {
      scientificName: "Ipomoea aquatica",
      region: "Wetlands, Assam, North-East India",
      medicinalValue: "Known for treating digestion issues",
      chemicalComposition: "Iron, Calcium, Vitamins A and C",
      traditionalUses: "Used in stir-fry, medicinal decoctions"
    },
    plant: dhekiaPlant._id
  };

  // Wipe old and insert new
  await Recipe.deleteMany({});
  await Recipe.insertMany([
    norohinghoDal,
    dhekiaBhaji,
    SengmoraGahori,
    kosuAruHukloti,
    bhedailota
  ]);

  console.log(" Recipe seeded successfully!");
  mongoose.connection.close();
}
