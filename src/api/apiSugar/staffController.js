/*
 * 职员管理接口
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const staffController = {
  // 获取职员信息模糊查询
  getStaffListByNameLike(params) {
    return axios.post(`${baseUrl.staffController}/getStaffListByNameLike`, params);
  },
};

export default staffController;
