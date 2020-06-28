/*
 * 现金回款控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const cashController = {
  // 根据合同id获取现金回款
  getCashesByContractId(params) {
    return axios.post(`${baseUrl.cashController}/getCashesByContractId`, params);
  },
  // 添加现金回款
  addCash(params) {
    return axios.post(`${baseUrl.cashController}/addCash`, params);
  },
  // 修改现金回款记录
  verifyCash(params) {
    return axios.post(`${baseUrl.cashController}/verifyCash`, params);
  },
  // 删除现金回款记录
  deleteCash(params) {
    return axios.post(`${baseUrl.cashController}/deleteCash`, params);
  },
  // 现金发票导出
  cashExport(params) {
    return axios.post(`${baseUrl.cashController}/export`, params, {
      responseType: 'blob'
    });
  },
  // 现金发票导入
  cashInput(params) {
    return axios.post(`${baseUrl.cashController}/input`, params);
  },
  // 获取最近几天现金信息
  getRecentCashes(params) {
    return axios.post(`${baseUrl.cashController}/getRecentCashes`, params);
  },
  // 根据合同号合同名称获取现金回款
  getCashesByIdLike(params) {
    return axios.post(`${baseUrl.cashController}/getCashesByIdLike`, params);
  },
  // 根据发票id获取对应现金列表
  getCashesByReceiptId(params) {
    return axios.post(`${baseUrl.cashController}/getCashesByReceiptId`, params);
  },
};

export default cashController;