var express = require("express");
var router = express.Router({mergeParams: true});
var Chat = require("../models/chat");
var Comment = require("../models/comment");

// ============
// COMMENTS ROUTES
// ============

// new comments
router.get("/new", isLoggedIn, function (req, res) {
    // find chat by ID
    Chat.findById(req.params.id, function (err, chat) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { chat: chat });
        }
    });
});

// create comments
router.post("/", isLoggedIn, function (req, res) {
    // look up chat using the id
    Chat.findById(req.params.id, function (err, chat) {
        if (err) {
            console.log(err);
            res.redirect("/chats");
        } else {
            console.log(req.body.comment);
            // create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // pushes comment into database and saves it
                    // then redirects back to the chat page
                    chat.comments.push(comment);
                    chat.save();
                    res.redirect("/chats/" + chat._id);
                }
            });
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;