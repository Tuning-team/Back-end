const mongoose = require("mongoose");

const VideoSearchSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("VideoSearchs", VideoSearchSchema);
