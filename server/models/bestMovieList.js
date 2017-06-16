const mongoose = require('mongoose');

const bestMovieListSchema = mongoose.Schema({
  FId: String,
  subject: String, //豆瓣电影id
  title: String, //标题
  year: String, //年份
  rate: String, //评分
  duration: String,
  region: String,
  director: String,
  actors: String,
  votecount: String,
  mainpic: String,
  link: String,
})

const BestMovieList = module.exports = mongoose.model('BestMovieList', bestMovieListSchema)
