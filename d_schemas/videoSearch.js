const mongoose = require("mongoose");

const VideoSearchSchema = new mongoose.Schema({
  _id: {
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
    required: true,    
  },
  createdAt: {
    type: String,
    required: true,   
  },
});

module.exports = mongoose.model("VideoSearchs", VideoSearchSchema);