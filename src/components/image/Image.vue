<template>
  <!-- <img :class="mainClass" :src="pictureSrc" alt="" @error="imageLoadError"> -->
  <div class="v-image" :style="wrapStyle" :class="mainClass">
    <img  :src="pictureSrc" :style="{display:'none'}" alt="" @error="imageLoadError">
  </div>
</template>

<script>
import {defaultProps, isUuid, oneOf} from '@/utils'

export default {
  props: defaultProps({
    src: '',
    type: oneOf(['photo', 'avatar', 'custom'], 'custom')
    // defaultSrc: require('src/assets/images/no-images.png')
  }),
  data () {
    return {
      error: false,
      srcData: this.src
    }
  },
  computed: {
    pictureSrc () {
      // console.log(this.src);
      if (isUuid(this.src)) {
        return `proxy/Ecp.Picture.view.img?pictureId=${this.src}`
      } else {
        return this.src
      }
    },
    mainClass () {
      return [
        this.type === 'avatar' ? 'avatar' : 'photo',
        {
        // 'avatar': this.type === 'avatar',
        // 'photo': this.type === 'photo',
          'loaderror': !!this.error
        }]
    },
    wrapStyle () {
      return this.error ? {} : {
        'background-image': `url(${this.pictureSrc})`
        // 'background-size': `${this.$el.clientWidth} ${this.$el.clientHeight}`
      }
    }
  },
  methods: {
    imageLoadError (event) {
      // image load error
      // debugger
      this.error = true
      // let _src = this.defaultSrc;
      // switch(this.type){
      //   case 'photo':
      //     _src = require('src/assets/images/no-images.png');
      //     break;
      //   case 'avatar':
      //     _src = require('src/assets/images/head.png');
      //     break;
      //   default:
      // }
      // debugger
      // this.$el.src = _src;
      // this.srcData = _src
    }
  },
  watch: {
    src (val) {
      this.error = false
      this.srcData = val
    }
  }
}
</script>
