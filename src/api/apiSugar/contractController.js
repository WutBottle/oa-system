/*
 * 合同控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表
import qs from 'qs'; // 根据需求是否导入qs模块

const contractController = {
    // 获取合同列表
    getContractList(params) {
      return axios.post(`${baseUrl.contractController}/getContractList`, params);
    },
  }
;

export default contractController;