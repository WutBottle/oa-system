/*
 * 分包类型控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const outContractCategoryController = {
  // 获取分包类型
  getOutContractCategoryListByNameLike(params) {
    return axios.post(`${baseUrl.outContractCategoryController}/getOutContractCategoryListByNameLike`, params);
  },
  // 获取分包类型选项
  getOutContractCategoryList() {
    return axios.get(`${baseUrl.outContractCategoryController}/getOutContractCategoryList`);
  },
  // 删除分包类型
  deleteOutContractCategory(params) {
    return axios.post(`${baseUrl.outContractCategoryController}/deleteOutContractCategory`, params);
  },
  // 新增分包类型
  addOutContractCategory(params) {
    return axios.post(`${baseUrl.outContractCategoryController}/addOutContractCategory`, params);
  },
};

export default outContractCategoryController;