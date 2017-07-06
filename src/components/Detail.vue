<template lang="html">
<section class="detail-container">
  <el-row :gutter="10">
    <el-col :span="18">
      <div class="movie-detail">
        <h2 class="heading">{{dataJson.title}} ({{dataJson.year}})</h2>
        <div class="movie-detail_info">
          <el-row>
            <el-col :span="8">
              <div class="movie-detail_mainpic">
                <span class="movie_rating">{{dataJson.rating.average}}</span>
                <img :src="dataJson.images.large" alt="">
              </div>
            </el-col>
            <el-col :span="16" id="info">
              <div class="movie__time"><span v-for="duration in dataJson.durations">{{duration}} </span></div>
              <p class="movie__option">
                <strong>导演: </strong>
                <a v-for="director in dataJson.directors">{{director.name}}</a>
              </p>
              <p class="movie__option">
                <strong>编剧: </strong>
                <a v-for="(writer, $index) in dataJson.writers">{{writer.name}} <span v-if="$index < dataJson.writers.length - 1"> | </span></a>
              </p>
              <p class="movie__option">
                <strong>主演: </strong>
                <a v-for="(cast, $index) in dataJson.casts">{{cast.name}} <span v-if="$index < dataJson.casts.length - 1"> | </span></a>
              </p>
              <p class="movie__option">
                <strong>类型: </strong>
                <span v-for="(genre, $index) in dataJson.genres">{{genre}} <span v-if="$index < dataJson.genres.length - 1"> , </span></span>
              </p>
              <p class="movie__option">
                <strong>官方网站: </strong>
                <a :href="'http://' + dataJson.website">{{dataJson.website}}</a>
              </p>
              <p class="movie__option">
                <strong>制片国家/地区: </strong>
                <span v-for="country in dataJson.countries">{{country}}</span>
              </p>
              <p class="movie__option">
                <strong>语言: </strong>
                <span v-for="language in dataJson.languages">{{language}}</span>
              </p>
              <p class="movie__option">
                <strong>上映日期: </strong>
                <span v-for="(pubdate, $index) in dataJson.pubdates">{{pubdate}} <span v-if="$index < dataJson.pubdates.length - 1"> | </span></span>
              </p>
              <p class="movie__option">
                <strong>又名: </strong>
                <span v-for="(ak, $index) in dataJson.aka">{{ak}} <span v-if="$index < dataJson.aka.length - 1"> | </span></span>
              </p>
            </el-col>
          </el-row>
          <el-col :span="24">
            <h2 class="heading" style="marginTop: 15px">剧情简介</h2>
            <div class="introduction">
              <div class="">{{dataJson.summary}}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <h2 class="heading" style="marginTop: 15px">预告片和剧照</h2>
            <div class="movie__media">
              <swiper :options="swiperOption">
                <swiper-slide v-for="photo in dataJson.photos">
                  <a class="movie__media-item" :href="photo.image">
                    <img :src="photo.image">
                  </a>
                </swiper-slide>
              </swiper>
            </div>
          </el-col>
          <el-col :span="24">
            <h2 class="heading" style="marginTop: 15px">短评</h2>
            <div class="comment-wrapper">
              <div class="comment-sets">
                <div class="comment" v-for="comment in dataJson.popular_comments">
                  <div class="comment__images">
                    <img :src="comment.author.avatar">
                  </div>
                  <a class="comment__author">{{comment.author.name}}</a>
                  <p class="comment__date">{{comment.created_at}}</p>
                  <p class="comment__message">{{comment.content}}</p>
                  <a class="comment__reply">回复</a>
                </div>
              </div>
            </div>
          </el-col>
          <!-- <el-col :span="24">
            <h2 class="heading" style="marginTop: 15px">热门影评</h2>
            <div class="comment-wrapper">
              <div class="comment-sets">
                <div class="comment" v-for="comment in dataJson.popular_reviews">
                  <div class="comment__images">
                    <img :src="comment.author.avatar">
                  </div>
                  <a class="comment__author">{{comment.author.name}}</a>
                  <p class="comment__date">{{comment.created_at}}</p>
                  <p class="comment__message">{{comment.summary}}</p>
                  <a class="comment__reply">回复</a>
                </div>
              </div>
            </div>
          </el-col> -->
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="layout-content-main advertisements">
        <div class="advertisement" v-for="item in 3">广告</div>
      </div>
    </el-col>
  </el-row>
</section>
</template>

<script>
import vImage from 'components/image'
export default {
  components: {
    vImage
  },
  data () {
    return {
      dataJson: {},
      swiperOption: {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        slidesPerView: 4,
        spaceBetween: 5,
        lazyLoading: true,
        breakpoints: {
          1024: {
            slidesPerView: 4,
            spaceBetween: 40
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
      }
    }
  },
  mounted () {
    this.fetchBestMovieData()
  },
  methods: {
    fetchBestMovieData (callback) {
      const _this = this
      _this.$jsonp(`https://api.douban.com/v2/movie/subject/${_this.$route.query.id}?apikey=0df993c66c0c636e29ecbb5344252a4a`)
        .then((res) => {
          this.dataJson = res
        })
    }
  }
}
</script>

<style lang="scss">
</style>
