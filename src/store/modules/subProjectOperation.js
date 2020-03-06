/*
* Author: zp
* 分项控制
*/
import api from '@/api/apiSugar'

const state = {

};

const mutations = {

};

const actions = {
  // 获取分项列表(根据合同id)
  getSubProjectListById({commit}, params) {
    return new Promise((resolve, reject) => {
      api.subProjectController.getSubProjectListById(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取分项列表失败');
        reject(error);
      });
    });
  },
  // 修改分项列表
  verifySubProject({commit}, params) {
    return new Promise((resolve, reject) => {
      api.subProjectController.verifySubProject(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改分项信息失败');
        reject(error);
      });
    });
  },
  // 删除分项列表
  deleteSubProject({commit}, params) {
    return new Promise((resolve, reject) => {
      api.subProjectController.deleteSubProject(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除分项信息失败');
        reject(error);
      });
    });
  },
  // 添加分项列表
  addSubProject({commit}, params) {
    return new Promise((resolve, reject) => {
      api.subProjectController.addSubProject(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加分项信息失败');
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