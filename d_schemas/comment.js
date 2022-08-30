const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  collection_id: {
    type: String,
    required: true,
    unique: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Comments", CommentSchema);
