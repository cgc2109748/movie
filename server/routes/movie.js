const express = require('express')
const router = express.Router()
const Movie = require('../models/movies')
const BestMovieList = require('../models/bestMovieList')

router.post('/Movie.Latest', (request, result) => {
  Movie.find({}, (err, res) => {
    if (!err) {
      result.json(res)
    }
  }).sort({'FId': -1}).skip(request.body.skip).limit(request.body.limit)
})

router.post('/Movie.Best', (request, result) => {
  BestMovieList.find({}, (err, res) => {
    if (!err) {
      result.json(res)
    }
  }).sort({'FId': 1}).skip(0).limit(6)
})

module.exports = router
