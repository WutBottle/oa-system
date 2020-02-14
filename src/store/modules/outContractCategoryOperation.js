/*
* Author: zp
* 权限控制
*/
import api from '@/api/apiSugar'

const state = {
  outContractCategoryList: [], // 分包类型
};

const mutations = {
  setOutContractCategoryList(state, data) {
    state.outContractCategoryList = data;
  },
};

const actions = {
  getOutContractCategoryList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractCategoryController.getOutContractCategoryList(params).then(res => {
        commit('setOutContractCategoryList', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取分包类型失败');
        reject(error);
      });
    });
  },
  getOutContractCategoryListByNameLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractCategoryController.getOutContractCategoryListByNameLike(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取分包类型失败');
        reject(error);
      });
    });
  },
  // 删除分包类型
  deleteOutContractCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractCategoryController.deleteOutContractCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除分包类型失败');
        reject(error);
      });
    });
  },
  // 新增分包类型
  addOutContractCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractCategoryController.addOutContractCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '新增分包类型失败');
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
