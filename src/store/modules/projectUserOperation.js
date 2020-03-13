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
  verifyProjectUser({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectUserController.verifyProjectUser(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改项目审批失败');
        reject(error);
      });
    });
  },
  getProjectByUserId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectUserController.getProjectByUserId(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取角色负责项目失败');
        reject(error);
      });
    });
  },
  deleteProjectUser({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectUserController.deleteProjectUser(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除角色负责项目失败');
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