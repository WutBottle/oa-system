/*
 * 备忘录接口调用
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const memorandumController = {
  // 添加备忘录
  addMemorandum(params) {
    return axios.post(`${baseUrl.memorandumController}/addMemorandum`, params);
  },
  // 修改备忘录
  verifyMemorandum(params) {
    return axios.post(`${baseUrl.memorandumController}/verifyMemorandum`, params);
  },
  // 获取已完成备忘录
  getMemorandumListDone(params) {
    return axios.post(`${baseUrl.memorandumController}/getMemorandumListDone`, params);
  },
  // 获取未完成备忘录
  getMemorandumListUndone(params) {
    return axios.post(`${baseUrl.memorandumController}/getMemorandumListUndone`, params);
  },
  // 完成备忘记录
  finishMemorandum(params) {
    return axios.post(`${baseUrl.memorandumController}/finishMemorandum`, params);
  },
  // 删除备忘记录
  deleteMemorandum(params) {
    return axios.post(`${baseUrl.memorandumController}/deleteMemorandum`, params);
  },
};

export default memorandumController;
