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
  shareAssignment(params) {
    return axios.post(`${baseUrl.assignmentController}/shareAssignment`, params);
  },
  deleteAssignment(params) {
    return axios.post(`${baseUrl.assignmentController}/deleteAssignment`, params);
  },
  finish(params) {
    return axios.post(`${baseUrl.assignmentController}/finish`, params);
  },
  verifyAssignment(params) {
    return axios.post(`${baseUrl.assignmentController}/verifyAssignment`, params);
  },
};

export default assignmentController;