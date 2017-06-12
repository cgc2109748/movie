<template>
  <div class="layout">
    <div class="header">
      <el-menu theme="dark" class="container nav-box" mode="horizontal">
          <!-- <div class="nav-box"> -->
            <div class="nav">
              <el-menu-item index="1">导航1</el-menu-item>
              <el-submenu index="2">
                <template slot="title">导航2</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
                <el-menu-item index="2-3">选项3</el-menu-item>
              </el-submenu>
              <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">导航3</a></el-menu-item>
            </div>
          <!-- </div> -->
      </el-menu>
    </div>
    <!-- <Menu mode="horizontal" active-name="1">
      <div class="layout-assistant">
        <Menu-item name="1">二级导航</Menu-item>
        <Menu-item name="2">二级导航</Menu-item>
        <Menu-item name="3">二级导航</Menu-item>
      </div>
    </Menu> -->
    <div class="carousel">
      <el-carousel trigger="click" height="500px" interval="5000">
        <el-carousel-item v-for="item in posters" :key="item">
          <!-- <div class="demo-carousel">{{item}}</div> -->
          <v-image :src="item.url" style="height: 500px"></v-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-row :gutter="16" style="margin: 0;">
      <el-col :span="16" :offset="4">
        <best></best>
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
          <div class="advertisement" v-for="item in 5">广告</div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Best from './Best.vue'
import MovieList from './MovieList.vue'
import vImage from '@/components/image'
export default {
  components: {
    Best,
    MovieList,
    vImage
  },
  data () {
    return {
      carousel: 0,
      movieList: [],
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
          // this.movieList = res.data
        })
    }
  },
  computed: {
  }
}
</script>

<style lang="scss">

</style>
