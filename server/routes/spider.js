const express = require('express')
const router = express.Router()
const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const eventproxy = require('eventproxy')
const Movie = require('../models/movies')
const base64 = require('../utils/base64')

const ep = eventproxy()

let pageList = []
let movieList = []
const Encoding = 'gb2312'

router.get('/Spider', function(req, res) {
  // 抓取电影列表
  console.log('正在抓取电影列表页!')
  request({
    url: 'http://www.dytt8.net/html/gndy/dyzz/index.html',
    encoding: null
  }, (err1, res1, body1) => {
    if (body1 !== undefined) {
      let html1 = iconv.decode(body1, Encoding)
      if (!err1 && res1.statusCode === 200) {
        $ = cheerio.load(html1, {
          decodeEntities: false
        }) //当前的$他是一个拿到了整个body前段选择器
        // console.log($('.bd3 .bd3r .co_area2 .co_content8 b').text())
        // /html/gndy/dyzz/20170529/54098.html
        let pageSize = 0
        let page = $($('.x a')[$('.x a').length - 1])
        const re_page = /.*?\d+.*?(\d+)/i
        pageSize = parseInt(page.attr('href').match(re_page)[1])

        console.log('正在抓取电影列表!')
        for (let i = 0; i < pageSize; i++) {
          // for (let i = 0; i < 5; i++) {
          // pageList[i] = 'http://www.dytt8.net/html/gndy/dyzz/list_23_' + (i + 1) + '.html'
          let url = 'http://www.dytt8.net/html/gndy/dyzz/list_23_' + (i + 1) + '.html'
          request({
            url: url,
            encoding: null
          }, (err2, res2, body2) => {
            if (body2 !== undefined) {
              let html2 = iconv.decode(body2, Encoding)

              if (!err2 && res2.statusCode === 200) {
                $ = cheerio.load(html2, {
                  decodeEntities: false
                })

                let list = $('.bd3 .bd3r .co_area2 .co_content8 b a')
                for (var j = 0; j < list.length; j++) {
                  let newMovieUrl = 'http://www.dytt8.net' + $(list[j]).attr('href')
                  if (movieList.indexOf(newMovieUrl)) {
                    movieList.push(newMovieUrl)
                  }

                  request({
                    url: newMovieUrl,
                    encoding: null
                  }, (err3, res3, body3) => {
                    if (body3 !== undefined) {
                      let html3 = iconv.decode(body3, Encoding)
                      if (!err3 && res3.statusCode === 200) {
                        const re = /\/([0-9].+)(?!.html)/
                        // console.log(newMovieUrl.match(re))
                        // console.log(newMovieUrl.match(re)[0])
                        if (newMovieUrl.match(re) !== null) {
                          $ = cheerio.load(html3, {
                            decodeEntities: false
                          })

                          const _content = $('.co_area2').text()
                          const _zoom = $('#Zoom').text()
                          // id
                          const _id = newMovieUrl.match(re)[0].slice(1, newMovieUrl.match(re)[0].length - 5).replace('/', '-')
                          // const _id = newMovieUrl.match(re)[0] === null ? '' : newMovieUrl.match(re)[0].slice(1, newMovieUrl.match(re)[0].length - 5).replace('/', '-')
                          // 标题
                          const _title = $('.co_area2 h1 font').text()
                          console.log('正在抓取电影:' + _title)
                          // 发布时间
                          // console.log(_content.match(/发布时间：/))
                          const _updateTime = _content.match(/发布时间：/) === null ? '' : _content.substring(_content.match(/发布时间：/).index + 5, _content.match(/发布时间：/).index + 　15)
                          // 海报
                          const _poster = $($('#Zoom p img')[0]).attr('src')
                          // 片名
                          const _name = _zoom.match(/◎片　　名.+?◎/) === null ? '' : _zoom.match(/◎片　　名.+?◎/)[0].replace('◎片　　名', '').replace('◎', '')
                          // 译名
                          const _translationName = _zoom.match(/◎译　　名.+?◎/) === null ? '' : _zoom.match(/◎译　　名.+?◎/)[0].replace('◎译　　名', '').replace('◎', '')
                          // 年代
                          const _year = _zoom.match(/◎年　　代.+?◎/) === null ? '' : _zoom.match(/◎年　　代.+?◎/)[0].replace('◎年　　代', '').replace('◎', '')
                          // 产地
                          const _contry = _zoom.match(/◎产　　地.+?◎/) === null ? '' : _zoom.match(/◎产　　地.+?◎/)[0].replace('◎产　　地', '').replace('◎', '')
                          // 类别
                          const _type = _zoom.match(/◎类　　别.+?◎/) === null ? '' : _zoom.match(/◎类　　别.+?◎/)[0].replace('◎类　　别', '').replace('◎', '')
                          // 语言
                          const _language = _zoom.match(/◎语　　言.+?◎/) === null ? '' : _zoom.match(/◎语　　言.+?◎/)[0].replace('◎语　　言', '').replace('◎', '')
                          // 字幕
                          const _subtitle = _zoom.match(/◎字　　幕.+?◎/) === null ? '' : _zoom.match(/◎字　　幕.+?◎/)[0].replace('◎字　　幕', '').replace('◎', '')
                          // IMDb评分
                          const _IMDBstars = _zoom.match(/◎IMDb评分.+?◎/) === null ? '' : _zoom.match(/◎IMDb评分.+?◎/)[0].replace('◎IMDb评分', '').replace('◎', '')
                          // 文件格式
                          const _fileType = _zoom.match(/◎文件格式.+?◎/) === null ? '' : _zoom.match(/◎文件格式.+?◎/)[0].replace('◎文件格式', '').replace('◎', '')
                          // 视频尺寸
                          const _videoSize = _zoom.match(/◎视频尺寸.+?◎/) === null ? '' : _zoom.match(/◎视频尺寸.+?◎/)[0].replace('◎视频尺寸', '').replace('◎', '')
                          // 文件大小
                          const _fileSize = _zoom.match(/◎文件大小.+?◎/) === null ? '' : _zoom.match(/◎文件大小.+?◎/)[0].replace('◎文件大小', '').replace('◎', '')
                          // 片长
                          const _long = _zoom.match(/◎片　　长.+?◎/) === null ? '' : _zoom.match(/◎片　　长.+?◎/)[0].replace('◎片　　长', '').replace('◎', '')
                          // 导演
                          const _director = _zoom.match(/◎导　　演.+?◎/) === null ? '' : _zoom.match(/◎导　　演.+?◎/)[0].replace('◎导　　演', '').replace('◎', '')
                          // 主演
                          const _performers = _zoom.match(/◎主　　演.+?◎/) === null ? '' : _zoom.match(/◎主　　演.+?◎/)[0].replace('◎主　　演', '').replace('◎', '')
                          // 简介
                          const _introduction = _zoom.match(/◎简　　介.+?\n/) === null ? '' : _zoom.match(/◎简　　介.+?\n/)[0].replace('◎简　　介', '')
                          // 图片
                          const _photo = $($('#Zoom p img')[1]).attr('src') === undefined ? '' : $($('#Zoom p img')[1]).attr('src')
                          // url
                          const _urlName = $($('#Zoom table a')[0]).attr('href') === undefined ? '' : $($('#Zoom table a')[0]).attr('href')
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
                          }
                          if (movieList.indexOf(newMovie) === -1) {
                            movieList.push(newMovie)
                          }
                          // console.log(_id)
                          Movie.find({
                            FId: _id
                          }, (err4, res4) => {
                            if (!err4) {
                              if (res4[0] === undefined || res4[0].FId === undefined) {
                                Movie.create(newMovie, (error) => {
                                  if (!error) {
                                    console.log('成功添加电影：' + _title)
                                  } else {
                                    console.log(error)
                                  }
                                })
                              } else {
                                if (res4[0].FId === _id) {
                                  Movie.update({
                                    FId: _id
                                  }, newMovie, (err5, res5) => {
                                    if (!err5) {
                                      console.log(_title + ' 更新成功!')
                                    }
                                  })
                                }
                              }
                            }
                          })
                        }
                      }
                    }
                  })
                }
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router
