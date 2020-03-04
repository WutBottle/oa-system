/*
 * 类型控制
 * 1.OutContractCategory 2.OutProjectCategory 3.OutProjectCategory 4.SubCategory 5.Organization
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const categoryController = {
  // 添加类型
  addCategory(params) {
    return axios.post(`${baseUrl.categoryController}/addCategory`, params);
  },
  // 修改类型
  verifyCategory(params) {
    return axios.post(`${baseUrl.categoryController}/verifyCategory`, params);
  },
  // 获取类型
  getCategoryList(params) {
    return axios.post(`${baseUrl.categoryController}/getCategoryList`, params);
  },
  // 获取类型(带模糊查询)
  getCategoryListByNameLike(params) {
    return axios.post(`${baseUrl.categoryController}/getCategoryListByNameLike`, params);
  },
  // 删除类型
  deleteCategory(params) {
    return axios.post(`${baseUrl.categoryController}/deleteCategory`, params);
  },
};

export default categoryController;