/*
 * 用户中心接口调用
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表
import qs from 'qs'; // 根据需求是否导入qs模块

const tokensController = {
  // 登录用户
  loginUser(params) {
    return axios.post(`${baseUrl.tokensController}`, params);
  },
  // 注销用户
  logout(params) {
    return axios.post(`${baseUrl.tokensController}/logout`, params);
  },
  // 注册新用户
  registerUserList(params) {
    return axios.post(`${baseUrl.tokensController}/register`, qs.stringify(params));
  },
};

export default tokensController;
