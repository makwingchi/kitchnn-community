// ================
// COMMENTS ROUTES
// ================

const express = require("express");
const router = express.Router({ mergeParams:true });
const Recipe = require("../models/recipe");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
	// find recipe by id
	Recipe.findById(req.params.id, (err, recipe) => {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {recipe: recipe});
		}
	});
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
	// lookup recipe using ID
	// create new comment
	// connect new comment to recipe
	// redirect recipe show page
	
	Recipe.findById(req.params.id, (err, recipe) => {
		if (err) {
			console.log(err);
			res.redirect("/recipes");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					req.flash("error", "Something went wrong.");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					recipe.comments.push(comment);
					recipe.save();
					req.flash("success", "Comment successfully added.");
					res.redirect("/recipes/" + recipe._id);
				}
			});
		}
	});
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Recipe.findById(req.params.id, (err, foundRecipe) => {
		if (err || !foundRecipe) {
			req.flash("error", "Recipe not found!");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
			}
		});
	})
});

// UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted.");
			res.redirect("/recipes/" + req.params.id);
		}
	})
})

module.exports = router;