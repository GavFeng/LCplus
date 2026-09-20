const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 1
  },
});

module.exports = mongoose.model("Tag", tagSchema);