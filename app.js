const path = require('path')
const pkg = require('./package')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./server/db/dbconfig')

const app = express()
const db = mongoose.connect(config.mongodb)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const spider = require('./server/routes/spider')
const spiderMovieList = require('./server/routes/spider-movieList')
const movie = require('./server/routes/movie')

// 数据库连接
db.connection.on("error", function(error) {
    console.log("数据库连接失败：" + error);
})
db.connection.on("open", function() {
    console.log("------数据库连接成功！------");
})

app.use('/api', spider)
app.use('/api', spiderMovieList)
app.use('/api', movie)

const server = app.listen(3000, function () {
const host = server.address().address
const port = server.address().port

  console.log(`${pkg.name} listening on port ${port}`)
})
