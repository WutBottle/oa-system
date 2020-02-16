/*
* Author: zp
* 动态权限
*/
import api from '@/api/apiSugar'

const state = {

};

const mutations = {

};

const actions = {
  // 获取动态列表
  getRecentOperates({commit}, params) {
    return new Promise((resolve, reject) => {
      api.operateRecordController.getRecentOperates(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取动态信息失败');
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
