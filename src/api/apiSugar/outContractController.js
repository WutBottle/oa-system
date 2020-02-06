/*
 * 分包合同控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const outContractController = {
  // 添加外包合同
  addOutContract(params) {
    return axios.post(`${baseUrl.outContractController}/addOutContract`, params);
  },
  // 获取分包类型选项
  getOutContractCategoryList() {
    return axios.get(`${baseUrl.outContractCategoryController}/getOutContractCategoryList`);
  },
  // 获取分包项目类型选项
  getOutProjectCategoryList() {
    return axios.get(`${baseUrl.outProjectCategoryController}/getOutProjectCategoryList`);
  },
  // 模糊插叙分包合同列表
  getOutContractListByIdLike(params) {
    return axios.post(`${baseUrl.outContractController}/getOutContractListByIdLike`, params);
  },
  // 根据合同id查询对应的分包合同列表
  getOutContractsByContractId(params) {
    return axios.post(`${baseUrl.outContractController}/getOutContractsByContractId`, params);
  },
  // 修改分包合同
  verifyOutContract(params) {
    return axios.post(`${baseUrl.outContractController}/verifyOutContract`, params);
  },
  // 删除分包合同
  deleteOutContract(params) {
    return axios.post(`${baseUrl.outContractController}/deleteOutContract`, params);
  },
  // 根据id模糊查询分包合同
  getOutContractIdsByIdLike(params) {
    return axios.post(`${baseUrl.outContractController}/getOutContractIdsByIdLike`, params);
  },
  // 分包合同导出
  exportOutContract(params) {
    return axios.post(`${baseUrl.outContractController}/export`, params, {
      responseType: 'blob'
    });
  },
  // 分包合同录入
  outContractInput(params) {
    return axios.post(`${baseUrl.outContractController}/input`, params);
  },
};

export default outContractController;