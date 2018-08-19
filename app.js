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

// SHOW - shows more info about one chat
app.get("/chats/:id", function(req, res) {
    // find the chat with the provided ID
    Chat.findById(req.params.id).populate("comments").exec(function(err, foundChat) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundChat);
            // render show template with that chat
            res.render("chats/show", {chat: foundChat});
        }
    });
});

// ============
// COMMENTS ROUTES
// ============

app.get("/chats/:id/comments/new", function(req, res) {
    // find chat by ID
    Chat.findById(req.params.id, function(err, chat) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {chat: chat});
        }
    });
});

app.post("/chats/:id/comments", function(req, res) {
    // look up chat using the id
    Chat.findById(req.params.id, function(err, chat) {
        if(err) {
            console.log(err);
            res.redirect("/chats");
        } else {
            console.log(req.body.comment);
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // pushes comment into database and saves it
                    // then redirects back to the chat page
                    chat.comments.push(comment);
                    chat.save();
                    res.redirect("/chats/" + campground._id);
                }
            });
        }
    });
});

app.listen(2000, function() {
    console.log("Chat app has started!");
});