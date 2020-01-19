/*
* Author: zp
* 登录处理
*/
import api from '@/api/apiSugar'
import {ACCESS_TOKEN} from '@/store/mutation-types'

const state = {
  status: '',
  token: localStorage.getItem(ACCESS_TOKEN) || '',
  user: {},
};

const mutations = {
  authRequest(state) {
    state.status = 'loading';
  },
  authSuccess(state, token, user) {
    state.status = 'success';
    state.token = token;
    state.user = user;
  },
  authError(state) {
    state.status = 'error';
  },
  updateUser(state, user) {
    state.user = user;
  },
  logOut(state) {
    state.status = '';
    state.token = '';
  },
};

const actions = {
  login({dispatch, commit, rootState}, params) {
    return new Promise((resolve, reject) => {
      commit('authRequest');
      api.userController.loginUser(params).then(res => {
        const token = res.data.data.token;
        //更新本地token
        localStorage.setItem(ACCESS_TOKEN, token);
        // localStorage.setItem('userRole', res.data.user.userRole);
        commit('authSuccess', token, res.data.user);
        resolve(res);
      }).catch(error => {
        commit('authError');
        localStorage.removeItem(ACCESS_TOKEN);
        reject(error);
      });
    })
  },
  update({commit}, params) {
    return new Promise((resolve, reject) => {
      api.userController.updateUser(params).then(res => {
        commit('updateUser', res.data.user);
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  checkIn({commit}, params){
    return new Promise((resolve, reject) => {
      commit('authRequest');
      api.userController.checkIn(params).then(res => {
        const token = res.data.token;
        //更新本地token
        localStorage.setItem(ACCESS_TOKEN, token);
        commit('authSuccess', token, res.data.user);
        resolve(res);
      }).catch(error => {
        commit('authError');
        localStorage.removeItem(ACCESS_TOKEN);
        reject(error);
      })
    });
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
