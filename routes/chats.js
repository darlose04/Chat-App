var express = require("express");
var router = express.Router();
var Chat = require("../models/chat");
var middleWare = require("../middleware");

// INDEX - show chats
router.get("/", function(req, res) {
  // get the chats from the database
  Chat.find({}, function(err, allChats) {
    if (err) {
      console.log(err);
    } else {
      res.render("chats/index", { chats: allChats });
    }
  });
});

// CREATE - add a new chat to the database
router.post("/", middleWare.isLoggedIn, function(req, res) {
  // get data from form and add to chats array
  var name = req.body.name;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newChat = { 
      name: name, 
      description: desc, 
      author: author 
    };
  // create new chat and save to the DB
  Chat.create(newChat, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // redirect back to chats page
      console.log(newlyCreated);
      res.redirect("/chats");
    }
  });
});

// NEW - show form to create a new chat
router.get("/new", middleWare.isLoggedIn, function(req, res) {
  res.render("chats/new");
});

// SHOW - shows more info about one chat
router.get("/:id", function(req, res) {
  // find the chat with the provided ID
  Chat.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundChat) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundChat);
        // render show template with that chat
        res.render("chats/show", { chat: foundChat });
      }
    });
});

// I MAY NOT NEED THESE FOR THIS SPECIFIC APP
// EDIT chat 
router.get("/:id/edit", middleWare.checkChatOwnership, function(req, res) {
    Chat.findById(req.params.id, function(err, foundChat) {
        res.render("chats/edit", {chat: foundChat});
    });
});

// UPDATE chat
router.put("/:id", middleWare.checkChatOwnership, function(req, res) {
    // find and update the correct chat
    Chat.findByIdAndUpdate(req.params.id, req.body.chat, function(err, updatedChat) {
        if (err) {
            res.redirect("/chats");
        } else {
            // redirect to show page
            res.redirect("/chats/" + req.params.id);
        }
    });
});

// DESTROY chat
router.delete("/:id", middleWare.checkChatOwnership, function(req, res) {
    Chat.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/chats");
        } else {
            res.redirect("/chats");
        }
    });
});

module.exports = router;
