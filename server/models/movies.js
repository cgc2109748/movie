const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  FId: String,
  title: String,
  poster: String,
  name: String,
  translationName: String,
  year: String,
  contry: String,
  type: String,
  subtitle: String,
  IMDBstars: String,
  fileType: String,
  long: String,
  director: String,
  performers: String,
  introduction: String,
  photo: String,
  urlName: String,
  url: String,
})

const Movie = module.exports = mongoose.model('Movie', movieSchema)
