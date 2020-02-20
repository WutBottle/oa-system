/*
* Author: zp
* 备忘录控制
*/
import api from '@/api/apiSugar'

const state = {

};

const mutations = {

};

const actions = {
  // 添加备忘记录
  addMemorandum({commit}, params) {
    return new Promise((resolve, reject) => {
      api.memorandumController.addMemorandum(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加备忘记录失败');
        reject(error);
      });
    });
  },
  // 修改备忘录
  verifyMemorandum({commit}, params) {
    return new Promise((resolve, reject) => {
      api.memorandumController.verifyMemorandum(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改备忘记录失败');
        reject(error);
      });
    });
  },
  // 获取已完成备忘录
  getMemorandumListDone({commit}, params) {
    return new Promise((resolve, reject) => {
      api.memorandumController.getMemorandumListDone(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取已完成备忘记录失败');
        reject(error);
      });
    });
  },
  // 获取未完成备忘录
  getMemorandumListUndone({commit}, params) {
    return new Promise((resolve, reject) => {
      api.memorandumController.getMemorandumListUndone(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取未完成备忘记录失败');
        reject(error);
      });
    });
  },
  // 完成备忘记录
  finishMemorandum({commit}, params) {
    return new Promise((resolve, reject) => {
      api.memorandumController.finishMemorandum(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '完成备忘记录失败');
        reject(error);
      });
    });
  },
  // 删除备忘记录
  deleteMemorandum({commit}, params) {
    return new Promise((resolve, reject) => {
      api.memorandumController.deleteMemorandum(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除备忘记录失败');
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
