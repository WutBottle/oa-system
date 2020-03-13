/*
 * 项目角色分配控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const projectUserController = {
  addProjectUser(params) {
    return axios.post(`${baseUrl.projectUserController}/addProjectUser`, params);
  },
  verifyProjectUser(params) {
    return axios.post(`${baseUrl.projectUserController}/verifyProjectUser`, params);
  },
  getProjectByUserId(params) {
    return axios.post(`${baseUrl.projectUserController}/getProjectByUserId`, params);
  },
  deleteProjectUser(params) {
    return axios.post(`${baseUrl.projectUserController}/deleteProjectUser`, params);
  },
};

export default projectUserController;