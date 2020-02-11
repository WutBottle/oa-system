/*
* Author: zp
* 职员管理
*/
import api from '@/api/apiSugar'

const state = {
  staffData: [],
  paginationProps: {
    pageSize: 6, // 默认每页显示数量
    current: 1,
  },
  listData: [],
  showLoadingMore: true,
};

const mutations = {
  setStaffData(state, data){
    state.staffData = data.content;
  },
  setListData(state, data) {
    if (state.paginationProps.current === data.totalPages){
      state.showLoadingMore = false;
    } else {
      state.showLoadingMore = true;
    }
    state.listData = state.listData.concat(data.content);
  },
  resetListData(state) {
    state.listData = [];
    state.showLoadingMore = false;
    state.paginationProps.current = 1;
  }
};

const actions = {
  // 获取职员列表(模糊查询)
  getStaffListByNameLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.getStaffListByNameLike(params).then(res => {
        resolve(res);
        commit('setStaffData', res.data.data)
      }).catch(error => {
        console.log(error, '获取职员列表失败');
        reject(error);
      });
    });
  },
  // 获取用户列表(list展示)
  getStaffListByNameLikeList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.getStaffListByNameLike(params).then(res => {
        resolve(res);
        res.data.data && commit('setListData', res.data.data);
      }).catch(error => {
        console.log(error, '获取用户列表失败');
        reject(error);
      });
    });
  },
  // 添加职员信息
  addStaff({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.addStaff(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加职员信息失败');
        reject(error);
      });
    });
  },
  // 添加职员信息
  deleteStaff({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.deleteStaff(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除职员信息失败');
        reject(error);
      });
    });
  },
  // 添加职员信息
  verifyStaff({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.verifyStaff(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改职员信息失败');
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
