const mongoose = require('mongoose');

const comment = mongoose.Schema({
  movieId: String,
  author: String,
  date: String,
  useful: String,
  star: String,
  type: String,
  text: String
})

const Comment = module.exports = mongoose.model('Comment', comment)
