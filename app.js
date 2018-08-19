var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/chat_app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// seedDB();

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/chat", function(req, res) {
    res.render("messages/message");
});


// ON VERSION 4


app.listen(2000, function() {
    console.log("Chat app has started!");
});