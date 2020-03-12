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
};

export default projectUserController;