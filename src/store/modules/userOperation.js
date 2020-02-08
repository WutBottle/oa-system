/*
* Author: zp
* 登录处理
*/
import api from '@/api/apiSugar'
import {ACCESS_TOKEN, ROLE, USERNAME} from '@/store/mutation-types'

const state = {
  status: '',
  token: localStorage.getItem(ACCESS_TOKEN) || '',
  role: localStorage.getItem(ROLE) || '',
  username: localStorage.getItem(USERNAME) || '',
};

const mutations = {
  authRequest(state) {
    state.status = 'loading';
  },
  authSuccess(state, user) {
    state.status = 'success';
    //更新本地token
    localStorage.setItem(ACCESS_TOKEN, user.token);
    localStorage.setItem(ROLE, user.role);
    localStorage.setItem(USERNAME, user.username);
    state.role = user.role;
    state.username = user.username;
  },
  authError(state) {
    state.status = 'error';
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ROLE);
    localStorage.removeItem(USERNAME);
  },
  logOut(state) {
    state.token = '';
    state.status = '';
    state.role = '';
    state.username = '';
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ROLE);
    localStorage.removeItem(USERNAME);
  },
};

const actions = {
  login({dispatch, commit, rootState}, params) {
    return new Promise((resolve, reject) => {
      commit('authRequest');
      api.userController.loginUser(params).then(res => {
        res.data.data && commit('authSuccess', res.data.data);
        resolve(res);
      }).catch(error => {
        commit('authError');
        reject(error);
      });
    })
  },
  logout({dispatch, commit, rootState}, params) {
    return new Promise((resolve, reject) => {
      commit('authRequest');
      api.userController.logout(params).then(res => {
        localStorage.removeItem(ACCESS_TOKEN);
        commit('logOut');
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
