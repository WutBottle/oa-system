/*
 * 现金回款控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const outPaidController = {
  // 根据分包合同id获取分包付款
  getOutPaidsByOutContractId(params) {
    return axios.post(`${baseUrl.outPaidController}/getOutPaidsByOutContractId`, params);
  },
  // 添加分包付款
  addOutPaid(params) {
    return axios.post(`${baseUrl.outPaidController}/addOutPaid`, params);
  },
  // 删除分包付款
  deleteOutPaid(params) {
    return axios.post(`${baseUrl.outPaidController}/deleteOutPaid`, params);
  },
  // 修改分包付款
  verifyOutPaid(params) {
    return axios.post(`${baseUrl.outPaidController}/verifyOutPaid`, params);
  },
  // 分包回款导出
  outPaidExport(params) {
    return axios.post(`${baseUrl.outPaidController}/export`, params, {
      responseType: 'blob'
    });
  },
  // 分包回款导入
  outPaidInput(params) {
    return axios.post(`${baseUrl.outPaidController}/input`, params, {
      responseType: 'blob'
    });
  },
};

export default outPaidController;