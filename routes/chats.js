var express = require("express");
var router = express.Router();
var Chat = require("../models/chat");

// INDEX - show chats
router.get("/", function (req, res) {
    // get the chats from the database
    Chat.find({}, function (err, allChats) {
        if (err) {
            console.log(err);
        } else {
            res.render("chats/index", { chats: allChats });
        }
    });
});

// CREATE - add a new chat to the database
router.post("/", function (req, res) {
    // get data from form and add to chats array
    var name = req.body.name;
    var desc = req.body.description;
    var newChat = { name: name, description: desc };
    // create new chat and save to the DB
    Chat.create(newChat, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to chats page
            res.redirect("/chats");
        }
    });
});

// NEW - show form to create a new chat
router.get("/new", function (req, res) {
    res.render("chats/new");
});

// SHOW - shows more info about one chat
router.get("/:id", function (req, res) {
    // find the chat with the provided ID
    Chat.findById(req.params.id)
        .populate("comments")
        .exec(function (err, foundChat) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundChat);
                // render show template with that chat
                res.render("chats/show", { chat: foundChat });
            }
        });
});

module.exports = router;