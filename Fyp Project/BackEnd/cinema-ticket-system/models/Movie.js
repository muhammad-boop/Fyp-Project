const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
   duration: {
    type: String,  // change from Number to String
    required: true,
  },
  releaseDate: { type: Date },
  language: { type: String, default: '' },
  cast: [{ type: String }] // Array of cast member names
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
