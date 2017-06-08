<template>
  <div class="layout">
    <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1">导航1</el-menu-item>
      <el-submenu index="2">
        <template slot="title">导航2</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
      <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">导航3</a></el-menu-item>
    </el-menu>
    <!-- <Menu mode="horizontal" active-name="1">
      <div class="layout-assistant">
        <Menu-item name="1">二级导航</Menu-item>
        <Menu-item name="2">二级导航</Menu-item>
        <Menu-item name="3">二级导航</Menu-item>
      </div>
    </Menu> -->
    <el-row :gutter="16" style="margin: 0;">
      <el-col :span="16" :offset="4">
        <div class="carousel">
          <el-carousel trigger="click" height="200px">
            <el-carousel-item v-for="item in 4" :key="item">
              <div class="demo-carousel">{{item}}</div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :span="12" :offset="4">
        <div class="layout-content-main">
          <movie-list :list="movieList"></movie-list>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="layout-content-main">
          广告栏
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import MovieList from './MovieList.vue'
export default {
  components: {
    MovieList
  },
  data () {
    return {
      carousel: 0,
      movieList: []
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
  }
}
</script>

<style lang="scss">
.layout{
  // border: 1px solid #d7dde4;
  // background: #f5f7f9;
}
.layout-logo{
  width: 100px;
  height: 30px;
  background: #2d8cf0;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav{
  width: 420px;
  margin: 0 auto;
}
.layout-assistant{
  width: 300px;
  margin: 0 auto;
  height: inherit;
}
.carousel {
  margin: 15px 0;

  .demo-carousel {
    height: 200px;
    line-height: 200px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    background: #506b9e;
  }
}
</style>
