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
<<<<<<< HEAD
=======
    required: true,    
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
>>>>>>> feature
  },
});

module.exports = mongoose.model("VideoSearchs", VideoSearchSchema);
