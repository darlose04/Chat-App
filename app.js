var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Comment = require("./models/comment"),
    Chat = require("./models/chat"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/chat_app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// seedDB();

app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX - show chats
app.get("/chats", function(req, res) {
    // get the chats from the database
    Chat.find({}, function(err, allChats) {
        if(err) {
            console.log(err);
        } else {
            res.render("chats/index", {chats: allChats});
        }
    });
});

// CREATE - add a new chat to the database
app.post("/chats", function(req, res) {
    // get data from form and add to chats array
    var name = req.body.name;
    var desc = req.body.description;
    var newChat = {name: name, description: desc};
    // create new chat and save to the DB
    Chat.create(newChat, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect back to chats page
            res.redirect("/chats");
        }
    });
});

// NEW - show form to create a new chat
app.get("/chats/new", function(req, res) {
    res.render("chats/new");
});




app.listen(2000, function() {
    console.log("Chat app has started!");
});