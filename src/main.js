// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import _ from 'lodash'
import VueJsonp from 'vue-jsonp'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/scss/font-awesome.scss'
import 'assets/styles/index.scss'

window._ = _
Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueJsonp)
Vue.use(VueAwesomeSwiper)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
