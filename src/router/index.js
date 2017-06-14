import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import Detail from '@/components/Detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    }
  ]
})
