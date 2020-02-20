/*
 * 发票控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const receiptController = {
  // 获取发票信息
  getReceiptListByIdLike(params) {
    return axios.post(`${baseUrl.receiptController}/getReceiptListByIdLike`, params);
  },
  // 根据合同查询发票信息
  getReceiptsByContractId(params) {
    return axios.post(`${baseUrl.receiptController}/getReceiptsByContractId`, params);
  },
  // 添加发票信息
  addReceipt(params) {
    return axios.post(`${baseUrl.receiptController}/addReceipt`, params);
  },
  // 修改发票信息
  verifyReceipt(params) {
    return axios.post(`${baseUrl.receiptController}/verifyReceipt`, params);
  },
  deleteReceipt(params) {
    return axios.post(`${baseUrl.receiptController}/deleteReceipt`, params);
  },
  // 上传发票文件
  receiptUpload(params) {
    return axios.post(`${baseUrl.receiptController}/upload`, params);
  },
  // 获取进几天的发票信息
  getRecentReceipts(params) {
    return axios.post(`${baseUrl.receiptController}/getRecentReceipts`, params);
  },
};

export default receiptController;