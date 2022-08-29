const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  categoryKoName: {
    type: String,
    required: true,
  },
  categoryEngName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("Categories", UserSchema);
