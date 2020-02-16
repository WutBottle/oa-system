/*
 * 动态接口调用
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const operateRecordController = {
  // 获取主页动态
  getRecentOperates(params) {
    return axios.post(`${baseUrl.operateRecordController}/getRecentOperates`, params);
  },
};

export default operateRecordController;
