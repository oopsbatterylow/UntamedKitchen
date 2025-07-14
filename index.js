const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const app = express();
const methodOverride = require("method-override");
require('dotenv').config();

// Models
const Plant = require("./models/plant");
const Recipe = require("./models/recipe");
const Fruit = require("./models/fruit");
const RecipeFruit = require("./models/recipeFruit");


// App setup
const port = 3000;
const MONGO_URL = process.env.MONGODB_URL;


// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));



// MongoDB connection
mongoose.connect(MONGO_URL)
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.log("DB Connection Error:", err));

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + unique + ext);
  }
});
const upload = multer({ storage: storage });



/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
  res.redirect("/cover");
});


app.get("/cover", (req, res) => {
  res.render("coverPage");
});


// Root redirect
app.get("/", (req, res) => {
  res.redirect("/plants");
});



//-------------plants-----------------------
// Show all plants
app.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.find({});
    res.render("plantPage", { plants });
  } catch (err) {
    res.status(500).send("Error loading plants.");
  }
});


// Show specific recipe
app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ plant: req.params.id }).populate("plant");
    if (!recipe) return res.status(404).send("Recipe not found.");
    res.render("recipeDetail", { recipe });
  } catch (err) {
    res.status(500).send("Error loading recipe.");
  }
});

// Show form to create a new plant and recipe
app.get("/createForm", async (req, res) => {
  res.render("createForm");
});

//edit
app.get("/plants/:id/edit", async (req, res) => {
  try {
    // Find the recipe based on the plant ID
    const recipe = await Recipe.findOne({ plant: req.params.id }).populate("plant");

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    res.render("editForm", { recipe });
  } catch (err) {
    console.error("❌ Error loading edit form:", err);
    res.status(500).send("Internal Server Error");
  }
});



// Handle form submission
app.post(
  "/edit/:id",
  upload.fields([
    { name: "plantImage", maxCount: 1 },
    { name: "dishImage", maxCount: 1 },
    { name: "ingredientsImages" }
  ]),
  async (req, res) => {
    const getFirstValue = (val) => Array.isArray(val) ? val[0] : val;

    try {
      const recipeId = req.params.id;

      const {
        plantName,
        scientificName,
        region,
        medicinalValue,
        chemicalComposition,
        traditionalUses,
        title,
        ingredientsNames,
        steps,
        calories,
        carbohydrates,
        protein,
        fats,
        fibre,
        sugar,
        iron,
        vitaminA,
        vitaminC
      } = req.body;

      const recipe = await Recipe.findById(recipeId).populate("plant");

      if (!recipe) {
        return res.status(404).send("Recipe not found.");
      }

      // Update plant
      recipe.plant.name = plantName;
      recipe.plant.scientificName = scientificName;
      recipe.plant.region = region;
      recipe.plant.medicinalValue = medicinalValue;
      recipe.plant.chemicalComposition = chemicalComposition;
      recipe.plant.traditionalUses = traditionalUses;

      if (req.files["plantImage"]) {
        recipe.plant.image = "/uploads/" + req.files["plantImage"][0].filename;
      }

      await recipe.plant.save();

      // Update recipe fields
      recipe.title = title;

      if (req.files["dishImage"]) {
        recipe.image = "/uploads/" + req.files["dishImage"][0].filename;
      }

      const ingredientNames = Array.isArray(ingredientsNames)
        ? ingredientsNames
        : [ingredientsNames];

      const ingredientImages = req.files["ingredientsImages"] || [];

      recipe.ingredients = ingredientNames.map((name, i) => ({
        name,
        image: ingredientImages[i]
          ? "/uploads/" + ingredientImages[i].filename
          : recipe.ingredients[i]?.image || "" 
      }));

      recipe.steps = Array.isArray(steps) ? steps : [steps];

      recipe.nutrition.calories = getFirstValue(calories);
      recipe.nutrition.carbohydrates = getFirstValue(carbohydrates);
      recipe.nutrition.protein = getFirstValue(protein);
      recipe.nutrition.fats = getFirstValue(fats);
      recipe.nutrition.fibre = getFirstValue(fibre);
      recipe.nutrition.sugar = getFirstValue(sugar);
      recipe.nutrition.iron = getFirstValue(iron);
      recipe.nutrition.vitaminA = getFirstValue(vitaminA);
      recipe.nutrition.vitaminC = getFirstValue(vitaminC);

      await recipe.save();

      res.redirect("/plants");
    } catch (err) {
      console.error("❌ Update Error:", err);
      res.status(500).send("Something went wrong.");
    }
  }
);


//new route
app.post(
  "/create",
  upload.fields([
    { name: "plantImage", maxCount: 1 },
    { name: "dishImage", maxCount: 1 },
    { name: "ingredientsImages", maxCount: 20 }
  ]),
  async (req, res) => {
    try {
      const {
        plantName,
        scientificName,
        region,
        medicinalValue,
        chemicalComposition,
        traditionalUses,
        title,
        ingredientsNames,
        steps,
        calories,
        carbohydrates,
        protein,
        fats,
        fibre,
        sugar,
        iron,
        vitaminA,
        vitaminC
      } = req.body;

      // Save plant
      const plant = new Plant({
        name: plantName,
        scientificName,
        region,
        medicinalValue,
        chemicalComposition,
        traditionalUses,
        image: req.files["plantImage"] ? "/uploads/" + req.files["plantImage"][0].filename : ""
      });
      await plant.save();

      // Ingredients
      const names = Array.isArray(ingredientsNames) ? ingredientsNames : [ingredientsNames];
      const images = req.files["ingredientsImages"] || [];
      const ingredients = names.map((name, i) => ({
        name,
        image: images[i] ? "/uploads/" + images[i].filename : ""
      }));

      // Steps
      const recipeSteps = Array.isArray(steps) ? steps : [steps];

      // Save recipe
      const recipe = new Recipe({
        title,
        image: req.files["dishImage"] ? "/uploads/" + req.files["dishImage"][0].filename : "",
        plant: plant._id,
        ingredients,
        steps: recipeSteps,
        nutrition: {
          calories,
          carbohydrates,
          protein,
          fats,
          fibre,
          sugar,
          iron,
          vitaminA,
          vitaminC
        }
      });
      await recipe.save();

      res.redirect("/plants");
    } catch (err) {
      console.error("❌ Create Error:", err);
      res.status(500).send("Error creating new plant and recipe.");
    }
  }
);




app.put("/plants/:id", upload.fields([
  { name: "plantImage", maxCount: 1 },
  { name: "dishImage", maxCount: 1 },
  { name: "ingredientsImages", maxCount: 20 }
]), async (req, res) => {
  try {
    const {
      plantName,
      scientificName,
      region,
      medicinalValue,
      chemicalComposition,
      traditionalUses,
      title,
      ingredientsNames,
      steps,
      calories,
      carbohydrates,
      protein,
      fats,
      fibre,
      sugar,
      iron,
      vitaminA,
      vitaminC
    } = req.body;

    // Find the plant and recipe
    const plant = await Plant.findById(req.params.id);
    const recipe = await Recipe.findOne({ plant: plant._id });

    if (!plant || !recipe) {
      return res.status(404).send("Plant or recipe not found.");
    }

    // Update plant fields
    plant.name = plantName;
    plant.scientificName = scientificName;
    plant.region = region;
    plant.medicinalValue = medicinalValue;
    plant.chemicalComposition = chemicalComposition;
    plant.traditionalUses = traditionalUses;

    if (req.files["plantImage"]) {
      plant.image = "/uploads/" + req.files["plantImage"][0].filename;
    }

    await plant.save();

    // Handle ingredients
    const ingredientNames = Array.isArray(ingredientsNames) ? ingredientsNames : [ingredientsNames];
    const ingredientImages = req.files["ingredientsImages"] || [];
    const ingredients = ingredientNames.map((name, i) => ({
      name,
      image: ingredientImages[i] ? "/uploads/" + ingredientImages[i].filename : (recipe.ingredients[i]?.image || "")
    }));

    // Update recipe fields
    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.steps = Array.isArray(steps) ? steps : [steps];
    recipe.nutrition = {
      calories,
      carbohydrates,
      protein,
      fats,
      fibre,
      sugar,
      iron,
      vitaminA,
      vitaminC
    };

    if (req.files["dishImage"]) {
      recipe.image = "/uploads/" + req.files["dishImage"][0].filename;
    }

    await recipe.save();

    res.redirect("/plants");
  } catch (err) {
    console.error("❌ Error updating:", err);
    res.status(500).send("Something went wrong.");
  }
});


app.post("/plants/:id/delete", async (req, res) => {
  try {
    const plantId = req.params.id;

    // First delete the recipe
    await Recipe.deleteOne({ plant: plantId });

    // Then delete the plant
    await Plant.findByIdAndDelete(plantId);

    res.redirect("/plants");
  } catch (err) {
    console.error("❌ Error deleting plant:", err);
    res.status(500).send("Error deleting plant and recipe.");
  }
});





//---------------------------------------------for fruits--------------------------------------------




// List fruits
app.get("/fruits", async (req, res) => {
  const fruits = await Fruit.find({});
  res.render("galleryPage", { items: fruits, type: "fruit" });
});

// Fruit detail
app.get("/fruit-recipes/:id", async (req, res) => {
  const recipe = await RecipeFruit.findOne({ fruit: req.params.id }).populate("fruit");
  if (!recipe) return res.status(404).send("Fruit recipe not found");
  res.render("fruitRecipe", { recipe });
});

//add fruit
// Show form to add new fruit
app.get("/fruits/new", (req, res) => {
  res.render("newFruit"); 
});


app.post(
  "/fruits/new",
  upload.fields([
    { name: "plantImage", maxCount: 1 },
    { name: "dishImage", maxCount: 1 },
    { name: "ingredientsImages", maxCount: 20 }
  ]),
  async (req, res) => {
    try {
      const {
        plantName,
        scientificName,
        region,
        medicinalValue,
        chemicalComposition,
        traditionalUses,
        title,
        ingredientsNames,
        steps,
        calories,
        carbohydrates,
        protein,
        fats,
        fibre,
        sugar,
        iron,
        vitaminA,
        vitaminC
      } = req.body;

      // Save fruit
      const fruit = new Fruit({
        name: plantName,
        scientificName,
        region,
        medicinalValue,
        chemicalComposition,
        traditionalUses,
        image: req.files["plantImage"]
          ? "/uploads/" + req.files["plantImage"][0].filename
          : ""
      });
      await fruit.save();

      // Handle ingredients
      const names = Array.isArray(ingredientsNames)
        ? ingredientsNames
        : [ingredientsNames];
      const images = req.files["ingredientsImages"] || [];

      const ingredients = names.map((name, i) => ({
        name,
        image: images[i] ? "/uploads/" + images[i].filename : ""
      }));

      // Steps
      const recipeSteps = Array.isArray(steps) ? steps : [steps];

      // Save recipe
      const recipe = new RecipeFruit({
        title,
        image: req.files["dishImage"]
          ? "/uploads/" + req.files["dishImage"][0].filename
          : "",
        fruit: fruit._id,
        ingredients,
        steps: recipeSteps,
        nutrition: {
          calories,
          carbohydrates,
          protein,
          fats,
          fibre,
          sugar,
          iron,
          vitaminA,
          vitaminC
        }
      });

      await recipe.save();
      res.redirect("/fruits");
    } catch (err) {
      console.error("❌ Error creating new fruit:", err);
      res.status(500).send("Error creating fruit and recipe.");
    }
  }
);




// Edit form
app.get("/fruits/:id/edit", async (req, res) => {
  const recipe = await RecipeFruit.findOne({ fruit: req.params.id }).populate("fruit");
  if (!recipe) return res.status(404).send("Fruit recipe not found");
  res.render("editFruit", { recipe });
});

// Update
app.put("/fruits/:id",
  upload.fields([
    { name: "plantImage", maxCount: 1 },
    { name: "dishImage", maxCount: 1 },
    { name: "ingredientsImages", maxCount: 20 }
  ]),
  async (req, res) => {
    try {
      const getFirstValue = (val) => Array.isArray(val) ? val[0] : val;

      const recipe = await RecipeFruit.findOne({ fruit: req.params.id }).populate("fruit");
      if (!recipe) return res.status(404).send("Fruit recipe not found");

      const {
        plantName, scientificName, region, medicinalValue, chemicalComposition,
        traditionalUses, title, ingredientsNames, steps,
        calories, carbohydrates, protein, fats, fibre, sugar, iron, vitaminA, vitaminC
      } = req.body;

      // Update fruit
      recipe.fruit.name = plantName;
      recipe.fruit.scientificName = scientificName;
      recipe.fruit.region = region;
      recipe.fruit.medicinalValue = medicinalValue;
      recipe.fruit.chemicalComposition = chemicalComposition;
      recipe.fruit.traditionalUses = traditionalUses;

      if (req.files["plantImage"]) {
        recipe.fruit.image = "/uploads/" + req.files["plantImage"][0].filename;
      }

      await recipe.fruit.save();

      // Update recipe
      recipe.title = title;
      if (req.files["dishImage"]) {
        recipe.image = "/uploads/" + req.files["dishImage"][0].filename;
      }

      const names = Array.isArray(ingredientsNames) ? ingredientsNames : [ingredientsNames];
      const images = req.files["ingredientsImages"] || [];
      recipe.ingredients = names.map((name, i) => ({
        name,
        image: images[i] ? "/uploads/" + images[i].filename : recipe.ingredients[i]?.image || ""
      }));

      recipe.steps = Array.isArray(steps) ? steps : [steps];
      recipe.nutrition = {
        calories: getFirstValue(calories),
        carbohydrates: getFirstValue(carbohydrates),
        protein: getFirstValue(protein),
        fats: getFirstValue(fats),
        fibre: getFirstValue(fibre),
        sugar: getFirstValue(sugar),
        iron: getFirstValue(iron),
        vitaminA: getFirstValue(vitaminA),
        vitaminC: getFirstValue(vitaminC)
      };

      await recipe.save();
      res.redirect("/fruits");

    } catch (err) {
      console.error(" Update fruit error:", err);
      res.status(500).send("Error updating fruit recipe.");
    }
  }
);


// Delete
app.post("/fruits/:id/delete", async (req, res) => {
  await RecipeFruit.deleteOne({ fruit: req.params.id });
  await Fruit.findByIdAndDelete(req.params.id);
  res.redirect("/fruits");
});



//---------------footer-----------
app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/collaboration', (req, res) => {
  res.render('collaboration');
});

app.get('/contact', (req, res) => {
  res.render('contact'); 
});



// Start the server
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
