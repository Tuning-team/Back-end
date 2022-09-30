const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  category_id: {
    type: Array,
    required: true,
    default: [],
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
  ytVideos: {
    type: Array,
    required: true,
    default: [],
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  keptBy: {
    type: Array,
    required: true,
    default: [],
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// CollectionSchema.index({ collectionTitle: 'text' , description: 'text'});

module.exports = mongoose.model("Collections", CollectionSchema);
