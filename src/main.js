import Vue from 'vue'
import App from './App.vue'
import { Button } from 'ant-design-vue';
import '@babel/polyfill';

Vue.config.productionTip = false;
Vue.component(Button.name, Button);

new Vue({
  render: h => h(App),
}).$mount('#app');
