<template lang="html">
  <div class="movie-card">
    <el-row :gutter="0">
      <el-col :span="12" v-for="(items, index) in list">
        <div class="card" v-for="(item, $index) in items"
        :class="{'right': isRight($index)}"
        :style="{'height': cardHeight}">
          <div class="card_img">
            <a class="card_link" href="">
              <img :src="item.poster" alt="">
            </a>
          </div>
          <div class="card_info">
            <a class="card_title" href="#" :title="titleHandler(item.title)">{{titleHandler(item.title)}}</a>
            <p class="card_time">{{textHandler(item.long)}}</p>
            <p class="card_option">{{optionHandler(textHandler(item.type))}}</p>
            <p class="card_rate">
              <el-rate v-model="item.star" allow-half disabled ></el-rate>
            </p>
            <div class="card_rating">{{item.star * 2}}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      cardHeight: '212px'
    }
  },
  mounted () {
    this.resize()
  },
  methods: {
    resize () {
      const _this = this
      const width = window.getComputedStyle(document.getElementsByClassName('card')[0]).width
      _this.cardHeight = Number(width.replace('px', '')) / 2 * 1.25 + 'px'
      window.onresize = () => {
        return (() => {
          const width = window.getComputedStyle(document.getElementsByClassName('card')[0]).width
          _this.cardHeight = Number(width.replace('px', '')) / 2 * 1.25 + 'px'
        })()
      }
    },
    isRight (index) {
      if (index % 2 !== 0) {
        return true
      }
    },
    titleHandler (val) {
      const start = val.indexOf('《') + 1
      const end = val.indexOf('》')
      return val.slice(start, end)
    },
    textHandler (val) {
      return val.replace(/(^　*)|(　*$)/g, '')//eslint-disable-line
    },
    optionHandler (val) {
      return _.join(_.words(val), ' | ')
    }
  }
}
</script>

<style lang="scss">
.movie-card {

  .card {
    background-color: #dbdee1;
    width: 100%;
    margin-bottom: 8px;
    height: 212px;
    overflow: hidden;

    &.right {
      .card_img {
        float: right;
      }
    }
    .card_img {
      float: left;
      width: 50%;
      border: none;
      position: relative;

      img {
        max-width: 100%;
        vertical-align: middle;
        border: 0;
      }

      &:before {
        content: "";
        width: 0px;
        height: 0px;
        border-style: solid;
        border-color: transparent #dbdee1 transparent transparent;
        position: absolute;
        top: 0;
        z-index: 20;
        border-width: 0 20px 20px 0;
        right: 0;
      }

      &:after {
        content: "";
        width: 1px;
        height: 30px;
        position: absolute;
        top: 0;
        right: 14px;
        background-color: #dbdee1;
        -webkit-transform: skewX(45deg);
        -ms-transform: skewX(45deg);
        transform: skewX(45deg);

      }

      .card_link {
        font-size: 13px;
        color: #4c4145;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        display: block;
        position: relative;
        text-decoration: none;
        background: transparent;

        &:after{
          content: '';
          background-color: rgba(255, 255, 255, 0);
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          -webkit-transition: 0.3s;
          transition: 0.3s;
          z-index: 19;
        }

        &:hover {
          &:after {
            background-color: rgba(255, 255, 255, 0.4);
          }
        }
      }
    }


    .card_info {
      overflow: hidden;
      padding: 17px 17px;
      position: relative;
      min-height: 200px;
      margin: 0;

      a {
        color: #4c4145;
        text-decoration: none;
      }

      p {
        font-size: 15px;
      line-height: 28px;
      color: #4c4145;
      margin-bottom: 28px;
      }

      .card_title {
        font-size: 16px;
        font-weight: bold;
        display: inline-block;
        margin-bottom: -6px;
        max-width: 330px;
        transition: 0.3s;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .card_time {
        position: relative;
        font-size: 13px;
        color: #fe505a;
        margin-bottom: 0;
        padding-left: 20px;

        &:before {
          content: "\f017";
          font: 16px "FontAwesome";
          color: #fe505a;
          position: absolute;
          top: 6px;
          left: 0;
        }
      }

      .card_option {
        font-size: 13px;
        margin-bottom: 3px;
      }

      .card_rate {
        border: none;
        bottom: 0;
        left: 0;
        width: 100%;
        font: 16px 'aleoregular', sans-serif;
        color: #4c4145;

        .el-rate__icon {
          font-size: 12px;
        }
      }

      .card_rating {
        display: block;
        position: absolute;
        bottom: 30px;
        right: 10px;
        left: auto;
        width: 47px;
        height: 47px;
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
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
    }
  }
}
</style>
