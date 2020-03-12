/*
* Author: zp
* 项目角色分配控制
*/
import api from '@/api/apiSugar'

const state = {
};

const mutations = {

};

const actions = {
  addProjectUser({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectUserController.addProjectUser(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加项目角色分配失败');
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