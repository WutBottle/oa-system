/*
* Author: zp
* 类型控制
*/
import api from '@/api/apiSugar'

const state = {

};

const mutations = {

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