<template lang="html">
  <div class="movie-best-container">
    <div class="movie-best">
      <el-row>
        <el-col :span="20" :offset="2">
          <div class="movie-best_rating">
            影院最热
          </div>
        </el-col>
        <el-col :span="24">
          <div class="movie-beta_item"
               v-for="(item, index) in dataJson"
               v-if="index < 6"
               :style="{'height': cardHeight}">
            <img :src="item.images.small" alt="" :style="{'height': cardHeight, 'width': '100%'}">
            <span class="best-rate">{{item.rating}}</span>
            <ul class="movie-beta_info">
              <li><span class="best-voted">{{item.collection}} 人评分</span></li>
              <li>
                <p>{{item.title}}</p>
                <!-- <p>{{item.orignal_title}}</p> -->
                <p class="movie__time">{{item.pubdate}}</p>
                <!-- <p>{{item.region}}</p> -->
              </li>
              <li class="last-block">
                <a class="slide__link" @click="click(item.id)">更多</a>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="20" :offset="2">
          <div class="movie-best__check"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {defaultProps} from '@/utils'
export default {
  props: defaultProps({
    dataJson: []
  }),
  data () {
    return {
      cardHeight: ''
    }
  },
  mounted () {
    this.resize()
  },
  updated () {
    this.resize()
  },
  methods: {
    resize () {
      const _this = this
      const width = window.getComputedStyle(document.getElementsByClassName('movie-beta_item')[0]).width
      _this.cardHeight = Number(width.replace('px', '')) * 1.4 + 'px'
      window.onresize = () => {
        return (() => {
          const width = window.getComputedStyle(document.getElementsByClassName('movie-beta_item')[0]).width
          _this.cardHeight = Number(width.replace('px', '')) * 1.4 + 'px'
        })()
      }
    },
    click (id) {
      this.$router.push({
        path: '/detail',
        query: {
          id: id,
          type: 'best'
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
