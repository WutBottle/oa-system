/*
 * 任务评论控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const feedBackController = {
  // 添加任务评论
  addFeedBack(params) {
    return axios.post(`${baseUrl.feedBackController}/addFeedBack`, params);
  },
  // 获取任务评论
  getFeedBackList(params) {
    return axios.post(`${baseUrl.feedBackController}/getFeedBackList`, params);
  },
  // 上传评论文件
  upload(params) {
    return axios.post(`${baseUrl.feedBackController}/upload`, params);
  },
  // 删除评论
  deleteFeedBack(params) {
    return axios.post(`${baseUrl.feedBackController}/deleteFeedBack`, params);
  },
};

export default feedBackController;