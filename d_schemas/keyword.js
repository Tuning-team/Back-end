const mongoose = require("mongoose");

const KeywordsSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  counts: {
    type: Number,
    required: true,
    default: 0,
  },
  whereTyped: {
    type: String,
    required: true,
    default: "collection",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Keywords", KeywordsSchema);
