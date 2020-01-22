import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import userOperation from './modules/userOperation'
import contractList from './modules/contractList'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    userOperation, //登录
    contractList, //合同信息
  },
  getters
});

export default store;
