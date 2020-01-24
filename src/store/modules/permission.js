/*
* Author: zp
* 权限控制
*/
import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import {ROLE} from '@/store/mutation-types'

const state = {
  routers: constantRouterMap,
  addRouters: []
};

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers;
    state.routers = constantRouterMap.concat(routers)
  }
};

const actions = {
  GenerateRoutes ({ commit }) {
    return new Promise(resolve => {
      if (localStorage.getItem(ROLE) === 'ROLE_ADMIN') {
        commit('SET_ROUTERS', asyncRouterMap);
      }
      resolve()
    })
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
