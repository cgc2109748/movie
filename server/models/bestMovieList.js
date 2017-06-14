const mongoose = require('mongoose');

const bestMovieListSchema = mongoose.Schema({
  FId: String,
  title: String,
  year: String,
  rate: String,
  duration: String,
  region: String,
  director: String,
  actors: String,
  votecount: String,
  subject: String,
  img: String
})

const BestMovieList = module.exports = mongoose.model('BestMovieList', bestMovieListSchema)
