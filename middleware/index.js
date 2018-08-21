var Chat = require("../models/chat");
var Comment = require("../models/comment");

// putting all middleware in this directory

var middlewareObj = {};

middlewareObj.checkChatOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Chat.findById(req.params.id, function(err, foundChat) {
            if(err || !foundChat) {
                req.flash("error", "Chat not found");
                res.redirect("back");
            } else {
                // does user own campground?
                if (foundChat.author.id.equals(req.user._id)) { // use .equals: first id is mongoose id, second id is string id: == or === won't work
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does user own comment?
                 if (foundComment.author.id.equals(req.user._id)) {
                     next();
                 } else {
                     req.flash("error", " You do not have permission to do that");
                     res.redirect("back");
                 }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;