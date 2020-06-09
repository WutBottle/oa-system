/*
* Author: zp
* 权限控制
*/
import { constantRouterMap } from '@/config/router.config'

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

export default {
  namespaced: true,
  state,
  mutations
}
