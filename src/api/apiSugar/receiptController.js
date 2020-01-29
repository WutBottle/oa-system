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
    }
  }
;

export default receiptController;