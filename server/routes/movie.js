const express = require('express')
const router = express.Router()
const Movie = require('../models/movies')

router.post('/Movie.Latest', (request, result) => {
  Movie.find({}, (err, res) => {
    if (!err) {
      result.json(res)
    }
  }).sort({'FId': -1}).skip(request.body.skip).limit(request.body.limit)
})

module.exports = router
