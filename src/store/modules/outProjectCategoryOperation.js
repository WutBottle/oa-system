/*
* Author: zp
* 分包项目类型控制
*/
import api from '@/api/apiSugar'

const state = {
  outProjectCategoryList: [], // 分包项目类型
};

const mutations = {
  setOutProjectCategoryList(state, data) {
    state.outProjectCategoryList = data;
  },
};

const actions = {
  getOutProjectCategoryList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outProjectCategoryController.getOutProjectCategoryList(params).then(res => {
        commit('setOutProjectCategoryList', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取分包项目类别失败');
        reject(error);
      });
    });
  },
  deleteOutProjectCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outProjectCategoryController.deleteOutProjectCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除分包项目类别失败');
        reject(error);
      });
    });
  },
  addOutProjectCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outProjectCategoryController.addOutProjectCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '新增分包项目类别失败');
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
