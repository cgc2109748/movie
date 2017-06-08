<template>
  <div class="layout">
    <Menu mode="horizontal" active-name="1">
      <div class="layout-logo">
        <!-- <img src="static/logo.png"> -->
      </div>
      <div class="layout-nav">
        <Menu-item name="1">
          <Icon type="ios-navigate"></Icon>
          导航一
        </Menu-item>
        <Menu-item name="2">
          <Icon type="ios-keypad"></Icon>
          导航二
        </Menu-item>
        <Menu-item name="3">
          <Icon type="ios-analytics"></Icon>
          导航三
        </Menu-item>
        <Menu-item name="4">
          <Icon type="ios-paper"></Icon>
          导航四
        </Menu-item>
      </div>
    </Menu>
    <!-- <Menu mode="horizontal" active-name="1">
      <div class="layout-assistant">
        <Menu-item name="1">二级导航</Menu-item>
        <Menu-item name="2">二级导航</Menu-item>
        <Menu-item name="3">二级导航</Menu-item>
      </div>
    </Menu> -->
    <Row>
      <Col span="16" offset="4">
        <div class="carousel">
          <Carousel v-model="carousel">
            <Carousel-item>
              <div class="demo-carousel">1</div>
            </Carousel-item>
            <Carousel-item>
              <div class="demo-carousel">2</div>
            </Carousel-item>
            <Carousel-item>
              <div class="demo-carousel">3</div>
            </Carousel-item>
            <Carousel-item>
              <div class="demo-carousel">4</div>
            </Carousel-item>
          </Carousel>
        </div>
      </Col>
      <Col span="4" offset="4">
        <Menu active-name="1-1" width="auto">
          <Menu-item name="1-1">导航 1</Menu-item>
          <Menu-item name="1-2">导航 2</Menu-item>
          <Menu-item name="1-3">导航 3</Menu-item>
          <Menu-item name="2-1">导航 4</Menu-item>
          <Menu-item name="2-2">导航 5</Menu-item>
        </Menu>
      </Col>
      <Col span="12">
        <div class="layout-content-main">内容区域</div>
      </Col>
    </Row>

  </div>
</template>

<script>
export default {
  data () {
    return {
      carousel: 0
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
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
.layout-content-main{
  padding: 10px;
  background: #FFF;
}
</style>
