/*
* Author: zp
* 角色控制
*/
import api from '@/api/apiSugar'

const state = {
  roleList: [],
};

const mutations = {
  setRoleList(state, data) {
    state.roleList = data;
  }
};

const actions = {
  getRoleList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.roleController.getRoleList(params).then(res => {
        console.log(res)
        res.data.data && commit('setRoleList', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取角色列表失败');
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