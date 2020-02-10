/*
* Author: zp
* 用户管理
*/
import api from '@/api/apiSugar'

const state = {
  paginationProps: {
    pageSize: 4, // 默认每页显示数量
    current: 1,
  },
  listData: [],
  showLoadingMore: true,
};

const mutations = {
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
  // 添加新用户
  register({commit}, params) {
    return new Promise((resolve, reject) => {
      api.userController.register(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加人员信息失败');
        reject(error);
      });
    });
  },
  // 获取用户列表
  getUserListByNameLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.userController.getUserListByNameLike(params).then(res => {
        resolve(res);
        res.data.data && commit('setListData', res.data.data);
      }).catch(error => {
        console.log(error, '获取用户列表失败');
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
