const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
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
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Collections", CollectionSchema);
