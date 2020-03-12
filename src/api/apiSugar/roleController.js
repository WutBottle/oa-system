/*
 * 角色控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const roleController = {
  getRoleList(params) {
    return axios.post(`${baseUrl.roleController}/getRoleList`, params);
  },
};

export default roleController;