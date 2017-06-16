const mongoose = require('mongoose');

const bestMovieSchema = mongoose.Schema({
  FId: String,
  subject: String, //豆瓣电影id
  title: String, //标题
  year: String, //年份
  mainpic: String, //海报
  rate: String, //评分
  info: String, //内容
  duration: String,
  region: String,
  director: String,
  actors: String,
  votecount: String,
  star1: String,
  star2: String,
  star3: String,
  star4: String,
  star5: String,
  introductionTitle: String,
  introduction: String
})

const BestMovie = module.exports = mongoose.model('BestMovie', bestMovieSchema)
