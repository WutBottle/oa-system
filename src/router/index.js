import Vue from 'vue'
import Router from 'vue-router'

// hack router push callback
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
};

import WorkPlace from 'components/MainPage/WorkPlace/WorkPlace'
import ListPage from 'components/MainPage/ListPage/ListPage'
import AnalysisPage from 'components/MainPage/AnalysisPage/AnalysisPage'
import UserCenter from 'components/MainPage/UserCenter/UserCenter'
import SettingPage from 'components/MainPage/SettingPage/SettingPage'

Vue.use(Router);

/* 一级二级路由配置示例 */
export default new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: () => import('components/LoginPage/LoginPage'),
    },
    {
      path: '/main',
      name: 'MainPage',
      component: () => import('components/MainPage/MainPage'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'workplace',
          name: 'workplace',
          component: WorkPlace,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'list',
          name: 'list',
          component: ListPage,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: AnalysisPage,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'usercenter',
          name: 'usercenter',
          component: UserCenter,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'setting',
          name: 'setting',
          component: SettingPage,
          meta: {
            requiresAuth: true
          }
        },
      ]
    }
  ]
})
