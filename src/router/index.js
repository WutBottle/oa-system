import Vue from 'vue'
import Router from 'vue-router'

import { constantRouterMap } from '@/config/router.config';

Vue.use(Router);

// hack router push callback
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err)
};

/* 一级二级路由配置示例 */
export default new Router({
  mode: 'history',
  routes: constantRouterMap
});

