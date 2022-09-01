const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
<<<<<<< HEAD
  videoTitle: {
    type: String,
    required: true,
  },
  channelTitle: {
    type: String,
    required: true,
  },
  channel_id: {
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
    type: String,
    required: true,
  },
=======
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    videoTitle: {
        type: String,
        required: true,        
      },
    channelTitle: {
        type: String,
        required: true,        
      },
    channel_id: {
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
>>>>>>> feature
});

module.exports = mongoose.model("Videos", VideoSchema);
