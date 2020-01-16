/*
 * 用户中心接口调用
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表
import qs from 'qs'; // 根据需求是否导入qs模块

const userController = {
  // 查询所有用户
  getUserList () {
    return axios.get(`${baseUrl.userController}/list`);
  },
  // 更新单个用户状态
  loginUser (params) {
    return axios.post(`${baseUrl.userController}/login`, params);
  },
  // 注册新用户
  registerUserList (params) {
    return axios.post(`${baseUrl.userController}/register`, qs.stringify(params));
  },
  // 删除单个用户
  removeUserList (params) {
    return axios.post(`${baseUrl.userController}/remove`, qs.stringify(params));
  },
  // 修改密码
  updateUser (params) {
    return axios.post(`${baseUrl.userController}/update`, params);
  },
  checkIn(params) {
    return axios.post(`${baseUrl.userController}/checkin`, params);
  }
};

export default userController;
