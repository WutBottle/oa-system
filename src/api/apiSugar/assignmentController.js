/*
 * 任务控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const assignmentController = {
  // 添加任务
  addAssignment(params) {
    return axios.post(`${baseUrl.assignmentController}/addAssignment`, params);
  },
  // 获取任务列表
  getAssignmentList(params) {
    return axios.post(`${baseUrl.assignmentController}/getAssignmentList`, params);
  },
  // 文件上传
  upload(params) {
    return axios.post(`${baseUrl.assignmentController}/upload`, params);
  },
};

export default assignmentController;