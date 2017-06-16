const express = require('express')
const router = express.Router()
const Movie = require('../models/movies')
const BestMovie = require('../models/bestMovie')
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

router.post('/Movie.GetBestMovie', (request, result) => {
  BestMovieList.find({FId: request.body.id}, (err, res) => {
    if (!err) {
      if (res[0].subject) {
        BestMovie.find({ subject: res[0].subject}, (err2, res2) => {
          result.json(res2)
        })
      }
    }
  })
})

module.exports = router
