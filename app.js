const express         = require("express");
const bodyParser      = require("body-parser");
const mongoose        = require("mongoose");
const flash           = require("connect-flash");
const passport        = require("passport");
const LocalStrategy   = require("passport-local");
const methodOverride  = require("method-override");
const Recipe      = require("./models/recipe.js");
const Comment         = require("./models/comment.js");
const User            = require("./models/user.js");
const keys            = require("./config/keys");

// Requiring routes
const commentRoutes    = require("./routes/comments");
const recipeRoutes = require("./routes/recipes");
const authRoutes       = require("./routes/index");


mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "hahaha",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/recipes/:id/comments", commentRoutes);
app.use("/recipes", recipeRoutes);
app.use(authRoutes);


const PORT = process.env.PORT || 5000


app.listen(PORT);