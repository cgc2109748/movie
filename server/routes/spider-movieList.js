const express = require('express')
const cheerio = require('cheerio')
const router = express.Router()
const superagent = require('superagent')
const async = require('async')
const eventproxy = require('eventproxy')
const Movie = require('../models/movies')
const BestMovie = require('../models/bestMovie')
const MovieList = require('../models/movieList')
const BestMovieList = require('../models/bestMovieList')
const charset = require('superagent-charset')
const base64 = require('../utils/base64')
const moment = require('moment')
charset(superagent)
const ep = eventproxy()
const app = express()

// const baseUrl = 'http://www.dytt8.net' //电影天堂首页链接
const latestMovieBaseUrl = 'http://www.dytt8.net/html/gndy/dyzz/index.html' //电影天堂首页最新电影列表链接
let latestMovieListLinkArr = [] //存放最新新电影
let latestMovieLinkArr = [] //存放最新新电影
let latestMovieErrLength = [] //统计出错的链接数

router.get('/Spider.MovieList', function(req, res, next) {
  //先抓取电影天堂首页
  (function(page) {
    superagent
      .get(page)
      .charset('gb2312')
      .end(function(err, sres) {
        // 常规的错误处理
        if (err) {
          console.log('抓取' + page + '这条信息的时候出错了')
          return next(err)
        }
        let $ = cheerio.load(sres.text, {
          decodeEntities: false
        })
        // 有多条电影链接，注意去重
        getAllLatestMovieLink($)
        /*
         *流程控制语句
         *当首页左侧的链接爬取完毕之后，我们就开始爬取里面的详情页
         */
        ep.emit('get_lm_html', 'get ' + page + ' successful')
      })
  })(latestMovieBaseUrl)

  // 命令 ep 重复监听 emit事件(get_lm_html)，当get_lm_html爬取完毕之后执行
  ep.after('get_lm_html', 1, function(eps) {
    let concurrencyCount = 0
    let num = -4 //因为是5个并发，所以需要减4

    // 利用callback函数将结果返回去，然后在结果中取出整个结果数组。
    let fetchUrl = function(myurl, callback) {
      let fetchStart = new Date().getTime()
      concurrencyCount++
      num += 1
      // console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', myurl)
      superagent
        .get(myurl)
        .charset('gb2312') //解决编码问题
        .end(function(err, ssres) {

          if (err) {
            callback(err, myurl + ' error happened!')
            latestMovieErrLength.push(myurl)
            return next(err)
          }

          let time = new Date().getTime() - fetchStart
          console.log('抓取 ' + myurl + ' 成功', '，耗时' + time + '毫秒')
          concurrencyCount--

          let $ = cheerio.load(ssres.text)

          // 对获取的结果进行处理函数
          getMovieLink($, (array) => {
            // console.log(array)
            for (var i = 0; i < array.length; i++) {
              let arr = array[i]
              if (latestMovieLinkArr.indexOf(arr) === -1) {
                latestMovieLinkArr.push(arr)
                Movie.find({address: arr}, (error, result) => {
                  if(!error) {
                    if (result[0] === undefined || result[0].address === undefined) {
                      getMovieDetail(arr, next)
                    }
                  }
                })
              }
            }
          })
          callback(null)
        })
    }

    // 控制最大并发数为5，在结果中取出callback返回来的整个结果数组。
    // mapLimit(arr, limit, iterator, [callback])
    async.mapLimit(latestMovieListLinkArr, 5, function(myurl, callback) {
      fetchUrl(myurl, callback)
    }, function(err, result) {
      // 爬虫结束后的回调，可以做一些统计结果
      console.log('抓包结束，一共抓取了-->' + latestMovieListLinkArr.length + '页数据')
      console.log('出错-->' + latestMovieErrLength.length + '条数据')
      console.log('最新电影：==》' + latestMovieLinkArr.length + '部')
      return false
    })
  })
})

// 获取最新电影列表的所有链接
function getAllLatestMovieLink($) {
  // var linkElem = 'http://www.dytt8.net/html/gndy/dyzz/index.html'
  let _pageSize = 0
  let _page = $($('.x a')[$('.x a').length - 1])
  const re_page = /.*?\d+.*?(\d+)/i
  pageSize = parseInt(_page.attr('href').match(re_page)[1])

  for (let i = 0; i < pageSize; i++) {
    let url = 'http://www.dytt8.net/html/gndy/dyzz/list_23_' + (i + 1) + '.html'
    // 注意去重
    if (latestMovieListLinkArr.indexOf(url) == -1) {
      latestMovieListLinkArr.push(url)
    }
  }
}
// 获取最热电影列表的所有链接
function getAllBestMovieLink($) {
  bestMovieListLinkArr = []
  let listElem = $('#nowplaying .mod-bd .lists .list-item')
  for (var i = 0; i < listElem.length; i++) {
    let _subject = $(listElem[i]).attr('data-subject') === undefined ? '' : $(listElem[i]).attr('data-subject')
    let _id = moment().format('YYYY-MM-DD-') + i + '-' + _subject
    let newMovie = {
      FId: _id,
      title: $(listElem[i]).attr('data-title') === undefined ? '' : $(listElem[i]).attr('data-title'),
      year: $(listElem[i]).attr('data-release') === undefined ? '' : $(listElem[i]).attr('data-release'),
      rate: $(listElem[i]).attr('data-score') === undefined ? '' : $(listElem[i]).attr('data-score'),
      duration: $(listElem[i]).attr('data-duration') === undefined ? '' : $(listElem[i]).attr('data-duration'),
      region: $(listElem[i]).attr('data-region') === undefined ? '' : $(listElem[i]).attr('data-region'),
      director: $(listElem[i]).attr('data-director') === undefined ? '' : $(listElem[i]).attr('data-director'),
      actors: $(listElem[i]).attr('data-actors') === undefined ? '' : $(listElem[i]).attr('data-actors'),
      votecount: $(listElem[i]).attr('data-votecount') === undefined ? '' : $(listElem[i]).attr('data-votecount'),
      subject: _subject,
      img: $($('#nowplaying .mod-bd .lists .list-item img')[i]).attr('src'),
      link: $($('#nowplaying .mod-bd .lists .list-item .poster a')[i]).attr('href')
    }
    if (bestMovieListLinkArr.indexOf(newMovie) === -1) {
      bestMovieListLinkArr.push(newMovie)
    }
    BestMovieList.find({
      FId: _id
    }, (err, res) => {
      if (!err) {
        if (res[0] === undefined || res[0].FId === undefined) {
          BestMovieList.create(newMovie, (error) => {
            if (!error) {
              console.log('成功添加最热电影!')
            } else{
              console.log(error)
            }
          })
        } else {
          if (res[0].FId === _id) {
            BestMovieList.update({
              FId: _id
            }, newMovie, (err2, res2)　=> {
              if (!err2) {
                console.log('成功更新最热电影!')
              }
            })
          }
        }
      }
    })
  }
}

// 获取下载链接
function getMovieLink($, callback) {
  let list = $('.bd3 .bd3r .co_area2 .co_content8 b a')
  let _Movielist = []

  for (let i = 0; i < list.length; i++) {
    let newMovieUrl = 'http://www.dytt8.net' + $(list[i]).attr('href')
    if (_Movielist.indexOf(newMovieUrl) === -1) {
      _Movielist.push(newMovieUrl)
      MovieList.find({
        link: newMovieUrl
      }, (err, res) => {
        if (res[0] === undefined || res[0].link === undefined) {
          MovieList.create({
            link: newMovieUrl
          }, (error) => {
            if (error) {
              console.log(error)
            }
          })
        }
      })
    }
  }

  callback(_Movielist)
}

function getBestMovieLink($, target, callback) {
  let bestMovie = {
    FId: target.FId,
    subject: target.subject,
    title: $($('#content h1 span')[0]).text(),
    year: $('#content h1 .year').text().replace('(', '').replace(')', ''),
    mainpic: $('#mainpic img').attr('src'),
    info: $('#info').html(),
    rate: target.rate,
    star1: $($('#interest_sectl .rating_per')[0]).text(),
    star2: $($('#interest_sectl .rating_per')[1]).text(),
    star3: $($('#interest_sectl .rating_per')[2]).text(),
    star4: $($('#interest_sectl .rating_per')[3]).text(),
    star5: $($('#interest_sectl .rating_per')[4]).text(),
    introductionTitle: $('.related-info h2 i').text(),
    introduction: $($('#link-report span')[0]).text()
  }

  BestMovie.find({subject: target.subject}, (err, res) => {
    if (!err) {
      if (res[0] === undefined || res[0].subject === undefined) {
        BestMovie.create(bestMovie, (error) => {
          if (!error) {
            console.log('成功添加最热电影详细内容!')
          } else {
            console.log(error)
          }
        })
      } else {
        if (res[0].subject === target.subject) {
          BestMovie.update({
            subject: target.subject
          }, bestMovie, (error2, resource2) => {
            if (!error2) {
              console.log('成功更新最热电影详细内容!')
            }
          })
        }
      }
    }
  })

  //获取评论
  let coments = []
  // console.log(bestMovie)

  // callback(_Movielist)
}

function getMovieDetail(url, next) {
  superagent
    .get(url)
    .charset('gb2312')
    .end(function(err, sres) {
      if (err) {
        console.log('抓取' + url + '这条信息的时候出错了')
        return next(err)
      } else {
        const re = /\/([0-9].+)(?!.html)/

        if (url.match(re) !== null) {
          const $ = cheerio.load(sres.text, {
            decodeEntities: false
          })

          const _content = $('.co_area2').text()
          const _zoom = $('#Zoom').text()
          // id
          const _id = url.match(re)[0].slice(1, url.match(re)[0].length - 5).replace('/', '-')
          // const _id = url.match(re)[0] === null ? '' : url.match(re)[0].slice(1, url.match(re)[0].length - 5).replace('/', '-')
          // 标题
          const _title = $('.co_area2 h1 font').text()
          console.log('正在抓取电影:' + _title)
          // 发布时间
          // console.log(_content.match(/发布时间：/))
          const _updateTime = _content.match(/发布时间：/) === null ? '-' : _content.substring(_content.match(/发布时间：/).index + 5, _content.match(/发布时间：/).index + 　15)
          // 海报
          const _poster = $($('#Zoom p img')[0]).attr('src')
          // 片名
          const _name = _zoom.match(/◎片　　名.+?◎/) === null ? '-' : _zoom.match(/◎片　　名.+?◎/)[0].replace('◎片　　名', '').replace('◎', '')
          // 译名
          const _translationName = _zoom.match(/◎译　　名.+?◎/) === null ? '-' : _zoom.match(/◎译　　名.+?◎/)[0].replace('◎译　　名', '').replace('◎', '')
          // 年代
          const _year = _zoom.match(/◎年　　代.+?◎/) === null ? '-' : _zoom.match(/◎年　　代.+?◎/)[0].replace('◎年　　代', '').replace('◎', '')
          // 产地
          const _contry = _zoom.match(/◎产　　地.+?◎/) === null ? '-' : _zoom.match(/◎产　　地.+?◎/)[0].replace('◎产　　地', '').replace('◎', '')
          // 类别
          const _type = _zoom.match(/◎类　　别.+?◎/) === null ? '-' : _zoom.match(/◎类　　别.+?◎/)[0].replace('◎类　　别', '').replace('◎', '')
          // 语言
          const _language = _zoom.match(/◎语　　言.+?◎/) === null ? '-' : _zoom.match(/◎语　　言.+?◎/)[0].replace('◎语　　言', '').replace('◎', '')
          // 字幕
          const _subtitle = _zoom.match(/◎字　　幕.+?◎/) === null ? '-' : _zoom.match(/◎字　　幕.+?◎/)[0].replace('◎字　　幕', '').replace('◎', '')
          // IMDb评分
          const _IMDBstars = _zoom.match(/◎IMDb评分.+?◎/) === null ? '-' : _zoom.match(/◎IMDb评分.+?◎/)[0].replace('◎IMDb评分', '').replace('◎', '')
          // 星级
          const _star = _IMDBstars === '' ? 0 : (parseFloat(_IMDBstars.slice(2, 5)) / 2).toFixed(1)
          // 文件格式
          const _fileType = _zoom.match(/◎文件格式.+?◎/) === null ? '-' : _zoom.match(/◎文件格式.+?◎/)[0].replace('◎文件格式', '').replace('◎', '')
          // 视频尺寸
          const _videoSize = _zoom.match(/◎视频尺寸.+?◎/) === null ? '-' : _zoom.match(/◎视频尺寸.+?◎/)[0].replace('◎视频尺寸', '').replace('◎', '')
          // 文件大小
          const _fileSize = _zoom.match(/◎文件大小.+?◎/) === null ? '-' : _zoom.match(/◎文件大小.+?◎/)[0].replace('◎文件大小', '').replace('◎', '')
          // 片长
          const _long = _zoom.match(/◎片　　长.+?◎/) === null ? '-' : _zoom.match(/◎片　　长.+?◎/)[0].replace('◎片　　长', '').replace('◎', '')
          // 导演
          const _director = _zoom.match(/◎导　　演.+?◎/) === null ? '-' : _zoom.match(/◎导　　演.+?◎/)[0].replace('◎导　　演', '').replace('◎', '')
          // 主演
          const _performers = _zoom.match(/◎主　　演.+?◎/) === null ? '-' : _zoom.match(/◎主　　演.+?◎/)[0].replace('◎主　　演', '').replace('◎', '')
          // 简介
          const _introduction = _zoom.match(/◎简　　介.+?\n/) === null ? '-' : _zoom.match(/◎简　　介.+?\n/)[0].replace('◎简　　介', '')
          // 图片
          const _photo = $($('#Zoom p img')[1]).attr('src') === undefined ? '-' : $($('#Zoom p img')[1]).attr('src')
          // url
          const _urlName = $($('#Zoom table a')[0]).attr('href') === undefined ? '-' : $($('#Zoom table a')[0]).attr('href')
          // url
          const _url = 'thunder://' + base64.encode64(`AA${$($('#Zoom table a')[0]).attr('href') === undefined ? '' : $($('#Zoom table a')[0]).attr('href')}ZZ`)
          // const _url = $('#Zoom table a').html().match(/dndkdhyu/)

          let newMovie = {
            FId: _id,
            title: _title,
            poster: _poster,
            name: _name,
            translationName: _translationName,
            year: _year,
            contry: _contry,
            type: _type,
            subtitle: _subtitle,
            IMDBstars: _IMDBstars,
            fileType: _fileType,
            long: _long,
            director: _director,
            performers: _performers,
            introduction: _introduction,
            photo: _photo,
            urlName: _urlName,
            url: _url,
            star: _star
          }

          Movie.find({
            FId: _id
          }, (err2, res2) => {
            if (!err2) {
              if (res2[0] === undefined || res2[0].FId === undefined) {
                Movie.create(newMovie, (error) => {
                  if (!error) {
                    console.log('成功添加电影：' + _title)
                  } else {
                    console.log(error)
                  }
                })
              } else {
                if (res2[0].FId === _id) {
                  Movie.update({
                    FId: _id
                  }, newMovie, (err3, res3) => {
                    if (!err3) {
                      console.log(_title + ' 更新成功!')
                    }
                  })
                }
              }
            }
          })
        }
      }
    })
}

function getBestMovieDetail(url, next) {
  superagent
    .get(url)
    .charset()
    .end((err, sres) => {
      if (err) {
        console.log('抓取' + url + '这条信息的时候出错了')
        return next(err)
      } else {

      }
    })
}

const bestMovieBaseUrl = 'https://movie.douban.com/cinema/nowplaying/shenzhen/' //豆瓣电影首页
let bestMovieListLinkArr = [] //存放最新新电影
let bestMovieLinkArr = [] //存放最新新电影
let bestMovieErrLength = [] //统计出错的链接数

router.get('/Spider.BestMovie', function(req, res, next) {
  //先抓取电影天堂首页
  (function(page) {
    superagent
      .get(page)
      .charset()
      .end(function(err, sres) {
        // 常规的错误处理
        if (err) {
          console.log('抓取' + page + '这条信息的时候出错了')
          return next(err)
        }
        let $ = cheerio.load(sres.text, {
          decodeEntities: false
        })
        // 有多条电影链接，注意去重
        getAllBestMovieLink($)
        /*
         *流程控制语句
         *当首页左侧的链接爬取完毕之后，我们就开始爬取里面的详情页
         */
        ep.emit('get_bm_html', 'get ' + page + ' successful')
      })
  })(bestMovieBaseUrl)

  // 命令 ep 重复监听 emit事件(get_bm_html)，当get_bm_html爬取完毕之后执行
  ep.after('get_bm_html', 1, function(eps) {
    // console.log(bestMovieListLinkArr)
    let concurrencyCount = 0
    let num = -4 //因为是5个并发，所以需要减4

    // 利用callback函数将结果返回去，然后在结果中取出整个结果数组。
    let fetchUrl = function(temp, callback) {
      let fetchStart = new Date().getTime()
      concurrencyCount++
      num += 1
      // console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', temp)
      superagent
        .get(temp.link)
        .charset() //解决编码问题
        .end(function(err, ssres) {

          if (err) {
            callback(err, temp + ' error happened!')
            bestMovieErrLength.push(temp.link)
            return next(err)
          }

          let time = new Date().getTime() - fetchStart
          console.log('抓取 ' + temp.link + ' 成功', '，耗时' + time + '毫秒')
          concurrencyCount--

          let $ = cheerio.load(ssres.text)

          // 对获取的结果进行处理函数
          getBestMovieLink($, temp, (array) => {
            // console.log(array)
            for (var i = 0; i < array.length; i++) {
              let arr = array[i]
              // console.log(arr.link)
              // if (bestMovieLinkArr.indexOf(arr) === -1) {
              //   bestMovieLinkArr.push(arr)
              //   BestMovieList.find({address: arr}, (error, result) => {
              //     if(!error) {
              //       if (result[0] === undefined || result[0].address === undefined) {
              //         getBestMovieDetail(arr, next)
              //       }
              //     }
              //   })
              // }
            }
          })
          callback(null)
        })
    }

    // 控制最大并发数为5，在结果中取出callback返回来的整个结果数组。
    // mapLimit(arr, limit, iterator, [callback])
    async.mapLimit(bestMovieListLinkArr, 5, function(myurl, callback) {
      fetchUrl(myurl, callback)
    }, function(err, result) {
      // 爬虫结束后的回调，可以做一些统计结果
      console.log('抓包结束，一共抓取了-->' + latestMovieListLinkArr.length + '页数据')
      console.log('出错-->' + bestMovieErrLength.length + '条数据')
      console.log('最新电影：==》' + latestMovieLinkArr.length + '部')
      return false
    })
  })
})



module.exports = router
