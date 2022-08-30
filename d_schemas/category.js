const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  youtubeCategoryId: {
    type: String,
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Categories", CategorySchema);
