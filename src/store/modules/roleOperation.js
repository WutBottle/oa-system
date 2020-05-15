/*
* Author: zp
* 角色控制
*/
import api from '@/api/apiSugar'
import {ROLE} from '@/store/mutation-types'

const state = {
  roleList: [],
};

const mutations = {
  setRoleList(state, data) {
    if (localStorage.getItem(ROLE) === '部门负责人' || localStorage.getItem(ROLE) === '普通用户') {
      state.roleList = data.filter((item) => item.name === '普通用户');
    } else {
      state.roleList = data;
    }
  }
};

const actions = {
  getRoleList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.roleController.getRoleList(params).then(res => {
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