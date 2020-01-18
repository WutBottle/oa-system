import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd);

import '@babel/polyfill';

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  //  matched的数组中包含$route对象的检查元字段
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 判断当前是否有登录的权限
    if (!localStorage.getItem('token')) {
      Vue.prototype.$message.error('请重新登录');
      next({
        path: '/',
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
