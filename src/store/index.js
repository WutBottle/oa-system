import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import userOperation from './modules/userOperation'
import contractList from './modules/contractList'
import permission from './modules/permission'
import receiptOperation from './modules/receiptOperation'
import outContractOperation from './modules/outContractOperation'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    userOperation, //登录
    contractList, //合同信息
    permission, // 权限控制
    receiptOperation, // 发票信息
    outContractOperation, // 外包合同信息
  },
  getters
});

export default store;
