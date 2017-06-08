const mongoose = require('mongoose');

const movieListSchema = mongoose.Schema({
  link: String
})

const MovieList = module.exports = mongoose.model('MovieList', movieListSchema)
