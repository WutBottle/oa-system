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
        res.data.data && commit('setListData', res.data.data);
        resolve(res);

      }).catch(error => {
        console.log(error, '获取用户列表失败');
        reject(error);
      });
    });
  },
  // 删除用户
  deleteUser({commit}, params) {
    return new Promise((resolve, reject) => {
      api.userController.deleteUser(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除用户失败');
        reject(error);
      });
    });
  },
  // 修改用户
  verifyUser({commit}, params) {
    return new Promise((resolve, reject) => {
      api.userController.verifyUser(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改用户失败');
        reject(error);
      });
    });
  },
  // 根据用户角色id获取用户列表
  getUserListByRoleId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.userController.getUserListByRoleId(params).then(res => {
        resolve(res);
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
