import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/* 一级二级路由配置示例 */
export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: () => import('./components/LoginPage/LoginPage'),
    },
    {
      path: '/main',
      name: 'MainPage',
      component: () => import('./components/MainPage/MainPage'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})
