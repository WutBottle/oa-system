/*
* Author: zp
* 项目类型控制
*/
import api from '@/api/apiSugar'

const state = {
  projectCategoryList: [], // 项目类型
};

const mutations = {
  setProjectCategoryList(state, data) {
    state.projectCategoryList = data;
  },
};

const actions = {
  // 获取项目类型列表
  getProjectCategoryList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectCategoryController.getProjectCategoryList(params).then(res => {
        res.data.data && commit('setProjectCategoryList', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取项目类型失败');
        reject(error);
      });
    });
  },
  // 获取项目类型(模糊查询)
  getProjectCategoryListByNameLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectCategoryController.getProjectCategoryListByNameLike(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取项目类型失败');
        reject(error);
      });
    });
  },
  deleteProjectCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectCategoryController.deleteProjectCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除分包项目类别失败');
        reject(error);
      });
    });
  },
  addProjectCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectCategoryController.addProjectCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '新增项目类别失败');
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
