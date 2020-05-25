// 解决ie兼容问题
import '@babel/polyfill';

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import './permission';

import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll);

Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
