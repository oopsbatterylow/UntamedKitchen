const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const app = express();
const methodOverride = require("method-override");
require('dotenv').config();

// Models
const Plant = require("./models/plant");
const Recipe = require("./models/recipe");
const Fruit = require("./models/fruit");
const RecipeFruit = require("./models/recipeFruit");

const {uploadToCloudinary, deleteFromCloudinary} = require('./utils/cloudinary')

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  const publicId = lastPart.split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${publicId}`;
};

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

// route to edit a plant
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

      // Handle plant image update
      if (req.files["plantImage"]) {
        // Delete old image from Cloudinary if it exists
        if (recipe.plant.image) {
          const publicId = getPublicIdFromUrl(recipe.plant.image);
          if (publicId) {
            await deleteFromCloudinary("plants", publicId.split('/')[1]);
          }
        }
        
        // Upload new image
        const filePath = req.files["plantImage"][0].path;
        const plantImageUrl = await uploadToCloudinary(filePath, "plants", "plant-" + Date.now());
        recipe.plant.image = plantImageUrl;
        fs.unlinkSync(filePath);
      }

      await recipe.plant.save();

      // Update recipe fields
      recipe.title = title;

      // Handle dish image update
      if (req.files["dishImage"]) {
        // Delete old image from Cloudinary if it exists
        if (recipe.image) {
          const publicId = getPublicIdFromUrl(recipe.image);
          if (publicId) {
            await deleteFromCloudinary("recipes", publicId.split('/')[1]);
          }
        }
        
        // Upload new image
        const filePath = req.files["dishImage"][0].path;
        const dishImageUrl = await uploadToCloudinary(filePath, "recipes", "dish-" + Date.now());
        recipe.image = dishImageUrl;
        fs.unlinkSync(filePath);
      }

      const ingredientNames = Array.isArray(ingredientsNames)
        ? ingredientsNames
        : [ingredientsNames];

      const ingredientImages = req.files["ingredientsImages"] || [];

      // Handle ingredients with image updates
      const updatedIngredients = await Promise.all(
        ingredientNames.map(async (name, i) => {
          let imageUrl = recipe.ingredients[i]?.image || "";
          
          if (ingredientImages[i]) {
            // Delete old ingredient image if it exists
            if (recipe.ingredients[i]?.image) {
              const publicId = getPublicIdFromUrl(recipe.ingredients[i].image);
              if (publicId) {
                await deleteFromCloudinary("ingredients", publicId.split('/')[1]);
              }
            }
            
            // Upload new ingredient image
            const filePath = ingredientImages[i].path;
            imageUrl = await uploadToCloudinary(filePath, "ingredients", `ingredient-${Date.now()}-${i}`);
            fs.unlinkSync(filePath);
          }
          
          return { name, image: imageUrl };
        })
      );

      recipe.ingredients = updatedIngredients;
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

//route to add a new plant (already has Cloudinary integration)
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

      // ✅ Upload plant image
      let plantImageUrl = "";
      if (req.files["plantImage"]) {
        const filePath = req.files["plantImage"][0].path;
        plantImageUrl = await uploadToCloudinary(filePath, "plants", "plant-" + Date.now());
        fs.unlinkSync(filePath);
      }

      // ✅ Save plant
      const plant = new Plant({
        name: plantName,
        scientificName,
        region,
        medicinalValue,
        chemicalComposition,
        traditionalUses,
        image: plantImageUrl
      });
      await plant.save();

      // ✅ Upload recipe (dish) image
      let dishImageUrl = "";
      if (req.files["dishImage"]) {
        const filePath = req.files["dishImage"][0].path;
        dishImageUrl = await uploadToCloudinary(filePath, "recipes", "dish-" + Date.now());
        fs.unlinkSync(filePath);
      }

      // ✅ Upload ingredients images
      const names = Array.isArray(ingredientsNames) ? ingredientsNames : [ingredientsNames];
      const images = req.files["ingredientsImages"] || [];

      const ingredients = await Promise.all(
        names.map(async (name, i) => {
          let imageUrl = "";
          if (images[i]) {
            const filePath = images[i].path;
            imageUrl = await uploadToCloudinary(filePath, "ingredients", `ingredient-${Date.now()}-${i}`);
            fs.unlinkSync(filePath);
          }
          return { name, image: imageUrl };
        })
      );

      // ✅ Recipe steps
      const recipeSteps = Array.isArray(steps) ? steps : [steps];

      // ✅ Save recipe
      const recipe = new Recipe({
        title,
        image: dishImageUrl,
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

//route to update a plant (PUT route)
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

    // Handle plant image update
    if (req.files["plantImage"]) {
      // Delete old image from Cloudinary if it exists
      if (plant.image) {
        const publicId = getPublicIdFromUrl(plant.image);
        if (publicId) {
          await deleteFromCloudinary("plants", publicId.split('/')[1]);
        }
      }
      
      // Upload new image
      const filePath = req.files["plantImage"][0].path;
      const plantImageUrl = await uploadToCloudinary(filePath, "plants", "plant-" + Date.now());
      plant.image = plantImageUrl;
      fs.unlinkSync(filePath);
    }

    await plant.save();

    // Handle ingredients with image updates
    const ingredientNames = Array.isArray(ingredientsNames) ? ingredientsNames : [ingredientsNames];
    const ingredientImages = req.files["ingredientsImages"] || [];
    
    const ingredients = await Promise.all(
      ingredientNames.map(async (name, i) => {
        let imageUrl = recipe.ingredients[i]?.image || "";
        
        if (ingredientImages[i]) {
          // Delete old ingredient image if it exists
          if (recipe.ingredients[i]?.image) {
            const publicId = getPublicIdFromUrl(recipe.ingredients[i].image);
            if (publicId) {
              await deleteFromCloudinary("ingredients", publicId.split('/')[1]);
            }
          }
          
          // Upload new ingredient image
          const filePath = ingredientImages[i].path;
          imageUrl = await uploadToCloudinary(filePath, "ingredients", `ingredient-${Date.now()}-${i}`);
          fs.unlinkSync(filePath);
        }
        
        return { name, image: imageUrl };
      })
    );

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

    // Handle dish image update
    if (req.files["dishImage"]) {
      // Delete old image from Cloudinary if it exists
      if (recipe.image) {
        const publicId = getPublicIdFromUrl(recipe.image);
        if (publicId) {
          await deleteFromCloudinary("recipes", publicId.split('/')[1]);
        }
      }
      
      // Upload new image
      const filePath = req.files["dishImage"][0].path;
      const dishImageUrl = await uploadToCloudinary(filePath, "recipes", "dish-" + Date.now());
      recipe.image = dishImageUrl;
      fs.unlinkSync(filePath);
    }

    await recipe.save();

    res.redirect("/plants");
  } catch (err) {
    console.error("❌ Error updating:", err);
    res.status(500).send("Something went wrong.");
  }
});

//route to delete a plant
app.post("/plants/:id/delete", async (req, res) => {
  try {
    const plantId = req.params.id;

    // Find the plant and recipe to get image URLs
    const plant = await Plant.findById(plantId);
    const recipe = await Recipe.findOne({ plant: plantId });

    if (plant) {
      // Delete plant image from Cloudinary
      if (plant.image) {
        const publicId = getPublicIdFromUrl(plant.image);
        if (publicId) {
          await deleteFromCloudinary("plants", publicId.split('/')[1]);
        }
      }

      // Delete recipe and ingredient images from Cloudinary
      if (recipe) {
        // Delete recipe image
        if (recipe.image) {
          const publicId = getPublicIdFromUrl(recipe.image);
          if (publicId) {
            await deleteFromCloudinary("recipes", publicId.split('/')[1]);
          }
        }

        // Delete ingredient images
        for (const ingredient of recipe.ingredients) {
          if (ingredient.image) {
            const publicId = getPublicIdFromUrl(ingredient.image);
            if (publicId) {
              await deleteFromCloudinary("ingredients", publicId.split('/')[1]);
            }
          }
        }
      }
    }

    // Delete from database
    await Recipe.deleteOne({ plant: plantId });
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

// Show form to add new fruit
app.get("/fruits/new", (req, res) => {
  res.render("newFruit"); 
});

// Add new fruit with Cloudinary integration
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

      // Upload fruit image
      let fruitImageUrl = "";
      if (req.files["plantImage"]) {
        const filePath = req.files["plantImage"][0].path;
        fruitImageUrl = await uploadToCloudinary(filePath, "fruits", "fruit-" + Date.now());
        fs.unlinkSync(filePath);
      }

      // Save fruit
      const fruit = new Fruit({
        name: plantName,
        scientificName,
        region,
        medicinalValue,
        chemicalComposition,
        traditionalUses,
        image: fruitImageUrl
      });
      await fruit.save();

      // Upload recipe (dish) image
      let dishImageUrl = "";
      if (req.files["dishImage"]) {
        const filePath = req.files["dishImage"][0].path;
        dishImageUrl = await uploadToCloudinary(filePath, "fruit-recipes", "fruit-dish-" + Date.now());
        fs.unlinkSync(filePath);
      }

      // Handle ingredients with image uploads
      const names = Array.isArray(ingredientsNames) ? ingredientsNames : [ingredientsNames];
      const images = req.files["ingredientsImages"] || [];

      const ingredients = await Promise.all(
        names.map(async (name, i) => {
          let imageUrl = "";
          if (images[i]) {
            const filePath = images[i].path;
            imageUrl = await uploadToCloudinary(filePath, "fruit-ingredients", `fruit-ingredient-${Date.now()}-${i}`);
            fs.unlinkSync(filePath);
          }
          return { name, image: imageUrl };
        })
      );

      // Steps
      const recipeSteps = Array.isArray(steps) ? steps : [steps];

      // Save recipe
      const recipe = new RecipeFruit({
        title,
        image: dishImageUrl,
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

// Update fruit with Cloudinary integration
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

      // Handle fruit image update
      if (req.files["plantImage"]) {
        // Delete old image from Cloudinary if it exists
        if (recipe.fruit.image) {
          const publicId = getPublicIdFromUrl(recipe.fruit.image);
          if (publicId) {
            await deleteFromCloudinary("fruits", publicId.split('/')[1]);
          }
        }
        
        // Upload new image
        const filePath = req.files["plantImage"][0].path;
        const fruitImageUrl = await uploadToCloudinary(filePath, "fruits", "fruit-" + Date.now());
        recipe.fruit.image = fruitImageUrl;
        fs.unlinkSync(filePath);
      }

      await recipe.fruit.save();

      // Update recipe
      recipe.title = title;

      // Handle dish image update
      if (req.files["dishImage"]) {
        // Delete old image from Cloudinary if it exists
        if (recipe.image) {
          const publicId = getPublicIdFromUrl(recipe.image);
          if (publicId) {
            await deleteFromCloudinary("fruit-recipes", publicId.split('/')[1]);
          }
        }
        
        // Upload new image
        const filePath = req.files["dishImage"][0].path;
        const dishImageUrl = await uploadToCloudinary(filePath, "fruit-recipes", "fruit-dish-" + Date.now());
        recipe.image = dishImageUrl;
        fs.unlinkSync(filePath);
      }

      // Handle ingredients with image updates
      const names = Array.isArray(ingredientsNames) ? ingredientsNames : [ingredientsNames];
      const images = req.files["ingredientsImages"] || [];
      
      const updatedIngredients = await Promise.all(
        names.map(async (name, i) => {
          let imageUrl = recipe.ingredients[i]?.image || "";
          
          if (images[i]) {
            // Delete old ingredient image if it exists
            if (recipe.ingredients[i]?.image) {
              const publicId = getPublicIdFromUrl(recipe.ingredients[i].image);
              if (publicId) {
                await deleteFromCloudinary("fruit-ingredients", publicId.split('/')[1]);
              }
            }
            
            // Upload new ingredient image
            const filePath = images[i].path;
            imageUrl = await uploadToCloudinary(filePath, "fruit-ingredients", `fruit-ingredient-${Date.now()}-${i}`);
            fs.unlinkSync(filePath);
          }
          
          return { name, image: imageUrl };
        })
      );

      recipe.ingredients = updatedIngredients;
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
      console.error("❌ Update fruit error:", err);
      res.status(500).send("Error updating fruit recipe.");
    }
  }
);

// Delete fruit with Cloudinary cleanup
app.post("/fruits/:id/delete", async (req, res) => {
  try {
    const fruitId = req.params.id;

    // Find the fruit and recipe to get image URLs
    const fruit = await Fruit.findById(fruitId);
    const recipe = await RecipeFruit.findOne({ fruit: fruitId });

    if (fruit) {
      // Delete fruit image from Cloudinary
      if (fruit.image) {
        const publicId = getPublicIdFromUrl(fruit.image);
        if (publicId) {
          await deleteFromCloudinary("fruits", publicId.split('/')[1]);
        }
      }

      // Delete recipe and ingredient images from Cloudinary
      if (recipe) {
        // Delete recipe image
        if (recipe.image) {
          const publicId = getPublicIdFromUrl(recipe.image);
          if (publicId) {
            await deleteFromCloudinary("fruit-recipes", publicId.split('/')[1]);
          }
        }

        // Delete ingredient images
        for (const ingredient of recipe.ingredients) {
          if (ingredient.image) {
            const publicId = getPublicIdFromUrl(ingredient.image);
            if (publicId) {
              await deleteFromCloudinary("fruit-ingredients", publicId.split('/')[1]);
            }
          }
        }
      }
    }

    // Delete from database
    await RecipeFruit.deleteOne({ fruit: fruitId });
    await Fruit.findByIdAndDelete(fruitId);

    res.redirect("/fruits");
  } catch (err) {
    console.error("❌ Error deleting fruit:", err);
    res.status(500).send("Error deleting fruit and recipe.");
  }
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