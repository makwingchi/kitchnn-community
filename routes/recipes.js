const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const middleware = require("../middleware/index.js");

// Index Route
router.get("/", function(req, res){
	// Get all recipes from DB
	Recipe.find({}, function(err, allRecipes){
		if (err) {
			console.log(err);
		} else {
			res.render("recipes/index", {recipes: allRecipes});
		}
	});
});

// Create Route
router.post("/", middleware.isLoggedIn, (req, res) => {
	// get data from form and add to recipes array
	const { name, image, time, description } = req.body;
	const author = {
		id: req.user._id,
		username: req.user.username
	}
	
	const newRecipe = {name:name, image:image, description:description, author:author, time:time};
	// Create a new recipe and save to DB
	Recipe.create(newRecipe, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			// redirect back to recipes page
			res.redirect("/recipes");
		}
	});
});

// New Route
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("recipes/new.ejs");
});

// Show Route
router.get("/:id", (req, res) => {
	// find the recipe with provided ID
	Recipe.findById(req.params.id).populate("comments").exec((err, foundRecipe) => {
		if (err || !foundRecipe) {
			req.flash("error", "Recipe not found!");
			res.redirect("back")
		} else {
			// render show template with tat recipe
			res.render("recipes/show.ejs", {recipe: foundRecipe});
		}
	});
});

// Edit Route
router.get("/:id/edit", middleware.checkRecipeOwnership, (req, res) => {
	Recipe.findById(req.params.id, (err, foundRecipe) => {
		res.render("recipes/edit", {recipe: foundRecipe});
	});
});

// Update Route
router.put("/:id", middleware.checkRecipeOwnership, (req, res) => {
	// find and update the correct recipe
	Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, (err, updatedRecipe) => {
		if(err){
			res.redirect("/recipes");
		} else{
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

// Destroy Route
router.delete("/:id", middleware.checkRecipeOwnership, (req, res) => {
	Recipe.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect("/recipes");
		} else {
			res.redirect("/recipes");
		}
	});
});


module.exports = router;