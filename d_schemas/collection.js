const mongoose = require("mongoose");

const Collection = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  category_id: {
    type: String,
    required: true,
    unique: true,
  },
  collectionTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videos: {
    type: Array,
    required: true,
    default: [],
  },
  likes: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Collections", Collection);
