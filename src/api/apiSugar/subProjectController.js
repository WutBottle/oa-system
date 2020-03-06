/*
 * 分项控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const subProjectController = {
  // 获取分项列表(根据合同id)
  getSubProjectListById(params) {
    return axios.post(`${baseUrl.subProjectController}/getSubProjectListById`, params);
  },
  // 获取分项列表(根据分项id)
  getOutContractListBySubId(params) {
    return axios.post(`${baseUrl.subProjectController}/getOutContractListBySubId`, params);
  },
  // 修改分项列表
  verifySubProject(params) {
    return axios.post(`${baseUrl.subProjectController}/verifySubProject`, params);
  },
  // 删除分项列表
  deleteSubProject(params) {
    return axios.post(`${baseUrl.subProjectController}/deleteSubProject`, params);
  },
  // 添加分项列表
  addSubProject(params) {
    return axios.post(`${baseUrl.subProjectController}/addSubProject`, params);
  },
};

export default subProjectController;