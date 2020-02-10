/*
* Author: zp
* 职员管理
*/
import api from '@/api/apiSugar'

const state = {
  staffData: [],
};

const mutations = {
  setStaffData(state, data){
    state.staffData = data.content;
  }
};

const actions = {
  // 获取职员列表(模糊查询)
  getStaffListByNameLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.getStaffListByNameLike(params).then(res => {
        resolve(res);
        commit('setStaffData', res.data.data)
      }).catch(error => {
        console.log(error, '获取职员列表失败');
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
