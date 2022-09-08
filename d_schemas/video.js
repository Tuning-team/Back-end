const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    unique: true,
    required: true,
  },
  videoTitle: {
    type: String,
    required: true,
  },
  channelTitle: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Videos", VideoSchema);
