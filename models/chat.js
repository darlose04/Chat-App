var mongoose = require("mongoose");

chatSchema = new mongoose.Schema({
    name: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Chat", chatSchema);