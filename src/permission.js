import router from './router'
import store from './store'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({showSpinner: false}); // NProgress Configuration
const whiteList = ['LoginPage']; // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  if (whiteList.includes(to.name)) {
    // 在免登录白名单，直接进入
    next();
  } else {
    if (to.meta.requireAuth) {
      store.dispatch('categoryOperation/getCategoryList', {categoryType: 11}).then(res => {
        if (res && res.data.meta.success){
          next();
        } else {
          router.replace({
            path: 'user/login',
          });
        }
      }).catch(error => {
      })
    } else {
      next();
    }
    NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
  }
});

router.afterEach(() => {
  NProgress.done() // finish progress bar
});