/*
 * 用户管理接口
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const userController = {
  // 注册新用户
  register(params) {
    return axios.post(`${baseUrl.userController}/register`, params);
  },
  // 获取系统用户列表
  getUserListByNameLike(params) {
    return axios.post(`${baseUrl.userController}/getUserListByNameLike`, params);
  },
  // 删除用户
  deleteUser(params) {
    return axios.post(`${baseUrl.userController}/deleteUser`, params);
  },
  // 修改用户
  verifyUser(params) {
    return axios.post(`${baseUrl.userController}/verifyUser`, params);
  },
  // 根据用户角色id获取用户列表
  getUserListByRoleId(params) {
    return axios.post(`${baseUrl.userController}/getUserListByRoleId`, params);
  },
};

export default userController;
