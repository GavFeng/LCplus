const mongoose = require("mongoose");


const solutionSchema = new mongoose.Schema({
  language: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
      required: true,
  },
  approach: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },
  explanation: {
    type: String,
    trim: true,
    maxLength: 2500,
  },
  code: {
    type: String,
    required: true,
    trim: true,
    maxLength: 10000,
  },

  timeComplexity: {
    type: String,
    trim: true,
    maxLength: 50,
  },

  spaceComplexity: {
    type: String,
    trim: true,
    maxLength: 50,
  },
});

const exampleSchema = new mongoose.Schema({
  input: {
    type: String,
    trim: true,
    maxLength: 2500,
  },
  output: {
    type: String,
    trim: true,
    maxLength: 2500,
  },
  explanation: {
    type: String,
    trim: true,
    maxLength: 2500,
  },
  images: [{
    url: { type: String, required: true },
    key: { type: String, required: true }
  }],
});


const problemSchema = new mongoose.Schema({
  problem: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    minLength: 1,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
    required: true,
  }],
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  examples:{
    type: [exampleSchema],
  },
  stars : {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  constraints: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },
  notes: {
    type: String,
    trim: true,
    maxLength: 250,
  },
  template: {
    type: String,
    trim: true,
    maxLength: 10000,
  },
  solutions: {
    type: [solutionSchema],
    default: [],
  }
});

module.exports = mongoose.model("Problem", problemSchema);