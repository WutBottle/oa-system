/*
 * 分包项目类型控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const outProjectCategoryController = {
  // 获取分包项目类型选项
  getOutProjectCategoryList() {
    return axios.get(`${baseUrl.outProjectCategoryController}/getOutProjectCategoryList`);
  },
  // 删除分包项目类型
  deleteOutProjectCategory(params) {
    return axios.post(`${baseUrl.outProjectCategoryController}/deleteOutProjectCategory`, params);
  },
  // 新增分包项目类型
  addOutProjectCategory(params) {
    return axios.post(`${baseUrl.outProjectCategoryController}/addOutProjectCategory`, params);
  },
};

export default outProjectCategoryController;