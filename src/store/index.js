import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import tokensOperation from './modules/tokensOperation'
import contractList from './modules/contractList'
import permission from './modules/permission'
import receiptOperation from './modules/receiptOperation'
import outContractOperation from './modules/outContractOperation'
import cashOperation from './modules/cashOperation'
import outPaidOperation from "./modules/outPaidOperation";
import userOperation from "./modules/userOperation";
import staffOperation from "./modules/staffOperation";
import salaryOperation from "./modules/salaryOperation";
import operateRecordOperation from "./modules/operateRecordOperation";
import memorandumOperation from "./modules/memorandumOperation";
import categoryOperation from "./modules/categoryOperation";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    tokensOperation, //登录
    contractList, //合同信息
    permission, // 权限控制
    receiptOperation, // 发票信息
    outContractOperation, // 外包合同信息
    cashOperation, // 现金回款信息
    outPaidOperation, // 分包付款信息
    userOperation, // 用户管理信息
    staffOperation, // 职员信息管理
    salaryOperation, // 工资信息管理
    operateRecordOperation, // 获取动态列表
    memorandumOperation, // 备忘录管理
    categoryOperation, // 类型管理
  },
  getters
});

export default store;
