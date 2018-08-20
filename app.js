var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  // Chat = require("./models/chat"),
  // Comment = require("./models/comment"),
  User = require("./models/user");

// requiring the routes
var chatRoutes = require("./routes/chats"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");
  
mongoose.connect("mongodb://localhost:27017/chat_app", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Shadow is the best dog ever",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRoutes);
app.use("/chats", chatRoutes);
app.use("/chats/:id/comments", commentRoutes);

app.listen(2000, function() {
  console.log("Chat app has started!");
});

