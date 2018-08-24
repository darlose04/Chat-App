var express = require("express");
var router = express.Router({ mergeParams: true });
var Chat = require("../models/chat");
var Comment = require("../models/comment");
var middleWare = require("../middleware");

// ============
// COMMENTS ROUTES
// ============

// // new comments
// router.get("/new", middleWare.isLoggedIn, function(req, res) {
//   // find chat by ID
//   Chat.findById(req.params.id, function(err, chat) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("comments/new", { chat: chat });
//     }
//   });
// });

// create comments
router.post("/", middleWare.isLoggedIn, function(req, res) {
  // look up chat using the id
  Chat.findById(req.params.id, function(err, chat) {
    if (err) {
      console.log(err);
      res.redirect("/chats");
    } else {
      console.log(req.body.comment);
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // pushes comment into database and saves it
          // then redirects back to the chat page
          chat.comments.push(comment);
          chat.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/chats/" + chat._id);
        }
      });
    }
  });
});

// EDIT comments
router.get("/:comment_id/edit", middleWare.checkCommentOwnership, function(req, res) {
    Chat.findById(req.params.id, function(err, foundChat) {
        if (err || !foundChat) {
            req.flash("error", "No chat found");
            return res.redirect("back");
        }
    })
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                chat_id: req.params.id, 
                comment: foundComment
            });
        }
    });
});

// UPDATE comments
router.put("/:comment_id", middleWare.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/chats/" + req.params.id);
        }
    });
});

// DESTROY comments
router.delete("/:comment_id", middleWare.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/chats/" + req.params.id);
        }
    });
});

module.exports = router;
