const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  collection_id: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Comments", CommentSchema);
