const express = require("express");
const app = express();
const { initializeDatabase } = require("./db/db.connect");
// const fs = require("fs");
const Recipes = require("./models/recipe.models");

initializeDatabase();

// const jsonData = fs.readFileSync("recipe.json", "utf-8");
// const recipesData = JSON.parse(jsonData);

app.use(express.json());

// function seedData() {
//   try {
//     for (const recipeData of recipesData) {
//       const newRecipe = new Recipes({
//         title: recipeData.title,
//         author: recipeData.author,
//         difficulty: recipeData.difficulty,
//         prepTime: recipeData.prepTime,
//         cookTime: recipeData.cookTime,
//         ingredients: recipeData.ingredients,
//         instructions: recipeData.instructions,
//         imageUrl: recipeData.imageUrl,
//       });

//       newRecipe.save();
//     }
//   } catch (error) {
//     console.log("Error seeding the data", error);
//   }
// }

// seedData();

// API route "/recipes"

app.get("/recipes", async (req, res) => {
  try{
    const recipe = await Recipes.find()
    res.json(recipe)
  } catch (error){
    res.status(500).json({error: "Error occured while fetching data."})
  }
})

// Create another recipe data in the database

async function createRecipes(newRecipe){
  try{
    const recipe = new Recipes(newRecipe)
    const saveRecipe = await recipe.save()
    return saveRecipe
  } catch (error){
    throw error
  }
}

app.post("/recipes", async (req, res) => {
  try{
    const savedRecipes = await createRecipes(req.body)
    res.status(201).json({message: "Recipe added successfully.", recipes: savedRecipes})
  } catch(error){
    res.status(500).json({error: "Failed to add book."})
  }
})

// API to find a recipe's details by its title

async function readAllRecipesByTitle(recipeTitle){
  try{
    const recipe = await Recipes.find({title: recipeTitle})
    return recipe
  } catch (error){
    throw error
  }
}

app.get("/recipes/:recipeTitle", async (req, res) => {
  try{
    const recipe = await readAllRecipesByTitle(req.params.recipeTitle)
    if(recipe.length != 0){
      res.json(recipe)
    } else{
      res.status(404).json({error: "No recipe found"})
    }
  } catch (error){
    res.status(500).json({error: "Failed to fetch recipe data."})
  }
})

// API to find details of the recipe by its author

async function readAllRecipesByAuthor(recipeAuthor){
  try{
    const recipe = await Recipes.find({author: recipeAuthor})
    return recipe
  } catch (error){
    throw error
  }
}

app.get("/recipes/authorName/:author", async (req, res) => {
  try{
    const recipe = await readAllRecipesByAuthor(req.params.author)
    if(recipe.length != 0){
      res.json(recipe)
    } else{
      res.status(404).json({error: "No recipe found."})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fetche recipe data."})
  }
})

// API to find recipes which are of 'Easy' difficulty level

async function readAllRecipesByLevel(recipeLevel){
  try{
    const recipe = await Recipes.find({difficulty: recipeLevel})
    return recipe
  } catch(error){
    throw error
  }
}

app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try{
    const recipe = await readAllRecipesByLevel(req.params.difficultyLevel)
    if(recipe.length != 0){
      res.json(recipe)
    } else{
      res.status(404).json({error: "Recipe not found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to fatch recipe data."})
  }
})

// API to update recipe details with the help of its id

async function readAllRecipesById(recipeId, dataToUpdate){
  try{
    const updatedRecipe = await Recipes.findByIdAndUpdate(recipeId, dataToUpdate, {new: true})
    return updatedRecipe
  } catch(error){
    console.log("Error in updating recipe's difficulty")
  }
}

app.post("/recipes/:recipeId", async (req, res) => {
  try{
    const updatedRecipe = await readAllRecipesById(req.params.recipeId, req.body)
    if(updatedRecipe){
      res.status(200).json({message: "Recipe data updated successfully", updatedRecipe: updatedRecipe})
    } else{
      res.status(404).json({error: "Recipe not found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to update recipe data."})
  }
})


// API to update recipe's prep time and cook time

async function readAllRecipesByTitle(recipeTitle, dataToUpdate){
  try{
    const updatedRecipe = await Recipes.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true})
    return updatedRecipe
  } catch(error){
    console.log("Error in updating recipe data.", error)
  }
}

app.post("/recipes/recipeTitle/:title", async (req, res) => {
  try{
    const updatedRecipe = await readAllRecipesByTitle(req.params.title, req.body)
    if(updatedRecipe){
      res.status(200).json({message: "Recipe updated successfully", updatedRecipe: updatedRecipe})
    } else{
      res.status(404).json({error: "Recipe not found"})
    }
  }  catch (error){
    res.status(500).json({error: "Failed to update recipe data."})
  }
})

// API to delete a recipe with the help of a recipe id

async function deleteRecipeById(recipeId){
  try{
    const recipe = await Recipes.findByIdAndDelete(recipeId)
    return recipe
  } catch(error){
    console.log(error)
  }
}

app.delete("/recipes/:recipeId", async (req, res) => {
  try{
    const recipe = await deleteRecipeById(req.params.recipeId)
    if(recipe){
      res.status(200).json({message: "Recipe deleted successfully", recipe: recipe})
    } else{
      res.status(404).json({error: "Recipe not found"})
    }
  } catch(error){
    res.status(500).json({error: "Failed to delete recipe data."})
  }
})









const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})