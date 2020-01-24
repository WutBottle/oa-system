import router from './router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {ACCESS_TOKEN} from '@/store/mutation-types'

NProgress.configure({showSpinner: false}); // NProgress Configuration
const whiteList = ['LoginPage']; // no redirect whitelist
const defaultRoutePath = '/main/workplace';

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  if (localStorage.getItem(ACCESS_TOKEN)) {
    if (to.path === '/user/login') {
      next({path: defaultRoutePath});
      NProgress.done()
    } else {
      // if (!store.getters.role) {
      //   store.dispatch('permission/GenerateRoutes').then(() => {
      //     // 根据roles权限生成可访问的路由表
      //     // 动态添加可访问路由表
      //     router.addRoutes(store.getters.addRouters);
      //     next();
      //   });
      // } else {
      //   next();
      // }
      next();
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({path: '/user/login', query: {redirect: to.fullPath}});
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  NProgress.done() // finish progress bar
});