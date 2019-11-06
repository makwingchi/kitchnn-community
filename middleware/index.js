const Recipe = require("../models/recipe");
const Comment = require("../models/comment");

// all the middleware goes here
const middlewareObj = {
	
};

middlewareObj.checkRecipeOwnership = (req, res, next) => {
	// Is user logged in?
	if (req.isAuthenticated()) {
		Recipe.findById(req.params.id, (err, foundRecipe) => {
			if (err || !foundRecipe){
				req.flash("error", "Recipe not found.");
				res.redirect("back");
			} else {
				// Does user own the recipe?
				if (foundRecipe.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Permission denied.");
					res.redirect("back");
				}
			}
		});
	} else {
		res.flash("error", "You need to be logged in to do that.")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
	// Is user logged in?
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err || !foundComment) {
				req.flash("error", "Comment not found!")
				res.redirect("back");
			} else {
				// Does user own the comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Permission denied.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
}

module.exports = middlewareObj;