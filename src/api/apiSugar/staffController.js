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
  // 添加职员信息
  addStaff(params) {
    return axios.post(`${baseUrl.staffController}/addStaff`, params);
  },
  // 删除职员信息
  deleteStaff(params) {
    return axios.post(`${baseUrl.staffController}/deleteStaff`, params);
  },
  // 修改职员信息
  verifyStaff(params) {
    return axios.post(`${baseUrl.staffController}/verifyStaff`, params);
  },
};

export default staffController;
