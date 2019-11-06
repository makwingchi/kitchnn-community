// ===========
// AUTH ROUTES
// ===========
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user")

// Root Route
router.get("/", (req, res) => {
	res.render("landing.ejs");
});


// show register form
router.get("/register", (req, res) => {
	res.render("register")
});

// handle sign up logic
router.post("/register", (req, res) => {
	const newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, (err, user) => {
		if (err)	{
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/recipes");
		})
	});
});

// show login form
router.get("/login", (req, res) => {
	res.render("login");
});

// handling log in logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/recipes",
	failureRedirect: "/login"
}), (req, res) => {	
});

// log out route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!")
	res.redirect("/recipes");
});


module.exports = router;