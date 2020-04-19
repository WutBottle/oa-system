/*
* Author: zp
* 类型控制
*/
import api from '@/api/apiSugar'

const state = {
  outContractCategoryList: [],
  outProjectCategoryList: [],
  projectCategoryList: [],
  subCategoryList: [],
  organizationList: [],
  productionStageList: [],
  departmentList: [],
  classificationList: [],
  rankList: [],
  dutyList: [],
  jobList: [],
};

const mutations = {
  setListData(state, {data, type}) {
    switch (type) {
      case 1:
        state.outContractCategoryList = data;
        break;
      case 2:
        state.outProjectCategoryList = data;
        break;
      case 3:
        state.projectCategoryList = data;
        break;
      case 4:
        state.subCategoryList = data;
        break;
      case 5:
        state.organizationList = data;
        break;
      case 6:
        state.productionStageList = data;
        break;
      case 7:
        state.departmentList = data;
        break;
      case 8:
        state.classificationList = data;
        break;
      case 9:
        state.rankList = data;
        break;
      case 10:
        state.dutyList = data;
        break;
      case 11:
        state.jobList = data;
        break;
      default:
        break;
    }
  }
};

const actions = {
  // 删除类型信息
  deleteCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.categoryController.deleteCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除失败');
        reject(error);
      });
    });
  },
  // 获取类型信息(带模糊查询)
  getCategoryListByNameLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.categoryController.getCategoryListByNameLike(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取类型失败');
        reject(error);
      });
    });
  },
  // 获取类型信息
  getCategoryList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.categoryController.getCategoryList(params).then(res => {
        res && commit('setListData', {
          data: res.data.data,
          type: params.categoryType
        });
        resolve(res);
      }).catch(error => {
        console.log(error, '获取类型失败');
        reject(error);
      });
    });
  },
  // 修改类型信息
  verifyCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.categoryController.verifyCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改类型失败');
        reject(error);
      });
    });
  },
  // 添加类型信息
  addCategory({commit}, params) {
    return new Promise((resolve, reject) => {
      api.categoryController.addCategory(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加类型失败');
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