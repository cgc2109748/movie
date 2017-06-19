<template lang="html">
<div class="homepage">
  <div class="carousel">
    <el-carousel trigger="click" height="500px" :interval="5000">
      <el-carousel-item v-for="item in posters" :key="item">
        <!-- <div class="demo-carousel">{{item}}</div> -->
        <v-image :src="item.url" style="height: 500px"></v-image>
      </el-carousel-item>
    </el-carousel>
  </div>
  <el-row :gutter="10" style="margin: 0;">
    <el-col :span="16" :offset="4">
      <best :data-json="bestMovieList"></best>
    </el-col>
    <el-col :span="16" :offset="4">
    </el-col>
    <el-col :span="12" :offset="4">
      <h2 class="heading">最新电影</h2>
      <div class="layout-content-main">
        <movie-list :list="movieList"></movie-list>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="layout-content-main advertisements">
        <div class="advertisement" v-for="item in 3">广告</div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import Best from 'components/Best.vue'
import vImage from 'components/image'
import MovieList from 'components/MovieList.vue'
export default {
  components: {
    Best,
    vImage,
    MovieList
  },
  data () {
    return {
      carousel: 0,
      movieList: [],
      bestMovieList: [],
      posters: [
        {url: 'static/assets/img/poster/29208.jpg'},
        {url: 'static/assets/img/poster/30336.jpg'},
        {url: 'static/assets/img/poster/105602.jpg'}
      ]
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      let args = {
        skip: 0,
        limit: 8
      }
      this.axios.post('/api/Movie.Latest', args)
        .then((res) => {
          let temp = _.chunk(res.data, 4)
          for (var i = 0; i < temp.length; i++) {
            let _temp = _.chunk(temp[i], 2)
            for (var j = 0; j < _temp.length; j++) {
              this.movieList.push(_temp[j])
            }
          }
        })
      // 豆瓣电影正在热映
      // this.axios.get('http://api.douban.com/v2/movie/nowplaying?apikey=0df993c66c0c636e29ecbb5344252a4a')
      //   .then((res) => {
      //     debugger
      //     this.bestMovieList = res.entries
      //   })
      this.$jsonp('http://api.douban.com/v2/movie/nowplaying?apikey=0df993c66c0c636e29ecbb5344252a4a')
        .then((res) => {
          this.bestMovieList = res.entries
        })
    }
  }
}
</script>

<style lang="css">
</style>
