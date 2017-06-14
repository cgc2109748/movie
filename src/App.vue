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
    <router-view></router-view>
    <footer class="footer-wrapper">
      <el-row>
        <el-col></el-col>
        <el-col></el-col>
        <el-col></el-col>
        <el-col></el-col>
      </el-row>
    </footer>
    <back-top></back-top>
  </div>
</template>

<script>
import BackTop from 'components/BackTop.vue'
export default {
  components: {
    BackTop
  }
}
</script>

<style lang="scss">

</style>
