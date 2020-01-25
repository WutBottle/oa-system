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
  }
};

export default projectCategoryController;
