<template lang="html">
<section class="detail-container">
  <el-col :span="18">
    <div class="movie-detail">
      <h2 class="heading">{{dataJson.title}} ({{dataJson.year}})</h2>
      <div class="movie-detail_info">
        <el-col :span="8">
          <div class="movie-detail_mainpic">
            <span class="movie_rating">{{dataJson.rating.average}}</span>
            <img :src="dataJson.images.large" alt="">
          </div>
        </el-col>
        <el-col :span="16" id="info"></el-col>
        <el-col :span="24">
          <h2 class="heading" style="marginTop: 15px">剧情简介</h2>
          <div class="introduction">
            <div class="">{{dataJson.summary}}</div>
          </div>
        </el-col>
        <el-col :span="24">
          <h2 class="heading" style="marginTop: 15px">预告片和剧照</h2>
          <div class="">
          </div>
        </el-col>
        <el-col :span="24">
          <h2 class="heading" style="marginTop: 15px">短评</h2>
          <div class="">
          </div>
        </el-col>
      </div>
    </div>
  </el-col>
  <el-col :span="6">
    <div class="layout-content-main advertisements">
      <div class="advertisement" v-for="item in 3">广告</div>
    </div>
  </el-col>
</section>
</template>

<script>
import $ from 'jquery'
export default {
  data () {
    return {
      dataJson: {}
    }
  },
  mounted () {
    this.fetchBestMovieData()
  },
  updated () {
    let Elm = document.getElementsByClassName('movie-detail_mainpic')[0]
    Elm.style.height = Number(window.getComputedStyle(Elm).height.replace('px', '')) - 4 + 'px'
  },
  methods: {
    fetchBestMovieData (callback) {
      // this.axios.post('api/Movie.GetBestMovie', {id: this.$route.query.id})
      //   .then((res) => {
      //     this.dataJson = res.data[0]
      //     document.getElementById('info').innerHTML = this.dataJson.info
      //     this.afterLoadBestMovie()
      //   })
      const _this = this
      _this.$jsonp(`https://api.douban.com/v2/movie/subject/${_this.$route.query.id}`)
        .then((res) => {
          this.dataJson = res
        })
    },
    afterLoadBestMovie () {
      let array = $('#info span span')
      let pl = $('#info .pl')
      for (var i = 0; i < array.length; i++) {
        if ($(array[i]).text() === '导演' ||
            $(array[i]).text() === '编剧' ||
            $(array[i]).text() === '主演') {
          $(array[i]).next().html($(array[i]).next().text())
        }
      }

      for (var j = 0; j < pl.length; j++) {
        console.log($(pl[j]).text() === '又名:')
        if ($(pl[j]).text() === '又名:') {
          console.log($(pl[j]).next().text() + '------')
        }
      }
    }
  }
}
</script>

<style lang="scss">
@media (min-width: 768px) {
  .detail-container {
    width: 750px;
  }
}
@media (min-width: 992px) {
  .detail-container {
    width: 970px;
  }
}
@media (min-width: 1200px) {
  .detail-container {
    width: 1170px;
  }
}

.detail-container {
  clear: both;
  margin-right: auto;
  margin-left: auto;
  position: relative;

  .advertisements {
    margin-top: 159px;
  }
}

.movie-detail {

  .heading {
    margin-top: 106px;
    margin-bottom: 27px;
  }

  .movie-detail_mainpic {
    position: relative;
    border: 3px solid #ffd564;

    .movie_rating {
      width: 44px;
      height: 33px;
      padding-top: 10px;
      -webkit-border-radius: 24px;
      -moz-border-radius: 24px;
      border-radius: 24px;
      background-color: #ffd564;
      border: solid 3px #fff;
      font: 16px 'Roboto', sans-serif;
      color: #4c4145;
      text-align: center;
      font-weight: bold;
      position: absolute;
      top: 6px;
      left: 6px;
    }

    img {
      max-width: 100%;
      // width: 100%;
    }
  }

  .movie-detail_info {
    #info {
      padding-left: 10px;
      padding-right: 10px;
      font-size: 13px;
      margin-bottom: 3px;
      line-height: 28px;
      color: #4c4145;
      margin: 0 0 10px;

      .pl {
        font-weight: bold;
      }

      & > span {
        font-size: 13px;
        margin-bottom: 3px;
        line-height: 28px;
        color: #4c4145;
        margin: 0 0 10px;
      }

      span[property="v:runtime"] {
        position: relative;
        // color: #fe505a;
        padding-left: 20px;

        &:before {
          content: "\f017";
          font: 16px "FontAwesome";
          color: #fe505a;
          position: absolute;
          top: 1px;
          left: 1px;
        }
      }

      a {
        font-size: 13px;
        color: #4c4145;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        text-decoration: none;

        &:hover {
          color: #fe505a;
          text-decoration: none;
        }
      }
    }

    .introduction {
      font-size: 13px;
      line-height: 28px;
      color: #4c4145;
      margin-bottom: 28px;
      margin: 0 0 10px;
    }
  }
}
</style>
