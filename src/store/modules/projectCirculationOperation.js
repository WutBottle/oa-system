/*
* Author: zp
* 审核控制
*/
import api from '@/api/apiSugar'

const state = {

};

const mutations = {

};

const actions = {
  // 获取审核
  getHistoryByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectCirculationController.getHistoryByContractId(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取审核失败');
        reject(error);
      });
    });
  },
  // 修改审批状态
  verifyProjectCirculation({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectCirculationController.verifyProjectCirculation(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改审批状态失败');
        reject(error);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}