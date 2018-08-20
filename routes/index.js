var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function (req, res) {
    res.render("landing");
});

// AUTHENTICATION ROUTES

// show register form
router.get("/register", function(req, res) {
  res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register", {"error": err.message});
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to Chat " + user.username);
      res.redirect("/chats");
    });
  });
});

// show login form
router.get("/login", function(req, res) {
  res.render("login");
});

// handles login logic // will have to use middleware here
router.post("/login", passport.authenticate("local", {
    successRedirect: "/chats",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("succes", "Logged Out");
  res.redirect("/chats");
});

module.exports = router;