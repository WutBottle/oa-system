/*
 * 用户中心接口调用
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const projectCategoryController = {
  // 获取项目类型
  getProjectCategoryList(params) {
    return axios.get(`${baseUrl.projectCategoryController}/getProjectCategoryList`, params);
  },
  // 获取项目类型(模糊查询)
  getProjectCategoryListByNameLike(params) {
    return axios.post(`${baseUrl.projectCategoryController}/getProjectCategoryListByNameLike`, params);
  },
  addProjectCategory(params) {
    return axios.post(`${baseUrl.projectCategoryController}/addProjectCategory`, params);
  },
  deleteProjectCategory(params) {
    return axios.post(`${baseUrl.projectCategoryController}/deleteProjectCategory`, params);
  },
};

export default projectCategoryController;
