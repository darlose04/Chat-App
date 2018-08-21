var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  // Chat = require("./models/chat"),
  // Comment = require("./models/comment"),
  User = require("./models/user");

var PORT = process.env.PORT || 2000;

// requiring the routes
var chatRoutes = require("./routes/chats"),
  commentRoutes = require("./routes/comments"),
  indexRoutes = require("./routes/index");

console.log(process.env.DBURL);
mongoose.connect(process.env.DBURL);

// var url = process.env.DBURL || "mongodb://localhost:27017/chat_app";
// mongoose.connect(url,{ useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Shadow is the best dog ever",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/chats", chatRoutes);
app.use("/chats/:id/comments", commentRoutes);

app.listen(PORT, function() {
  console.log("Chat app has started!");
});
