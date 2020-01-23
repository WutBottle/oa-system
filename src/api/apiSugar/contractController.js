/*
 * 合同控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表
import qs from 'qs'; // 根据需求是否导入qs模块

const contractController = {
    // 合同文件下载
    downloadContract(params) {
      return axios.post(`${baseUrl.contractController}/download`, params, {
        responseType: 'blob'
      });
    },
    // 获取合同列表(带模糊查询)
    getContractListById(params) {
      return axios.post(`${baseUrl.contractController}/getContractListByIdLike`, params);
    },
    // 添加合同信息
    addContract(params) {
      return axios.post(`${baseUrl.contractController}/addContract`, params);
    }
  }
;

export default contractController;