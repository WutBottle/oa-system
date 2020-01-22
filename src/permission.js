import Vue from 'vue'
import router from './router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {ACCESS_TOKEN} from '@/store/mutation-types'

NProgress.configure({showSpinner: false}); // NProgress Configuration

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 判断当前是否有登录的权限
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      Vue.prototype.$message.error('请重新登录');
      NProgress.done();
      next({
        path: '/',
      })
    } else {
      NProgress.done();
      next()
    }
  } else {
    NProgress.done();
    next() // 确保一定要调用 next()
  }
});

router.afterEach(() => {
  NProgress.done() // finish progress bar
});