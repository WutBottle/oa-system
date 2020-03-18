/*
 * 审核控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const projectCirculationController = {
  // 获取流转信息
  getHistoryByContractId(params) {
    return axios.post(`${baseUrl.projectCirculationController}/getHistoryByContractId`, params);
  },
  // 修改审批状态
  verifyProjectCirculation(params) {
    return axios.post(`${baseUrl.projectCirculationController}/verifyProjectCirculation`, params);
  },
};

export default projectCirculationController;