var Chat = require("../models/chat");
var Comment = require("../models/comment");

// putting all middleware in this directory

var middlewareObj = {};

middlewareObj.checkChatOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Chat.findById(req.params.id, function(err, foundChat) {
            if(err) {
                res.redirect("back");
            } else {
                // does user own campground?
                if (foundChat.author.id.equals(req.user._id)) { // use .equals: first id is mongoose id, second id is string id: == or === won't work
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment._id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own comment?
                 if (foundComment.author.id.equals(req.user._id)) {
                     next();
                 } else {
                     res.redirect("back");
                 }
            }
        });
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;