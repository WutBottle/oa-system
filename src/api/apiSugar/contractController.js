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
  // 导出合同文件
  exportContract(params) {
    return axios.post(`${baseUrl.contractController}/export`, params, {
      responseType: 'blob'
    });
  },
  // 添加合同信息
  addContract(params) {
    return axios.post(`${baseUrl.contractController}/addContract`, params);
  },
  // 上传合同扫描文件
  uploadContract(params) {
    return axios.post(`${baseUrl.contractController}/upload`, params);
  },
  // 上传合同录入excel信息
  contractInput(params) {
    return axios.post(`${baseUrl.contractController}/input`, params);
  },
  // 批量删除合同信息
  deleteContract(params) {
    return axios.post(`${baseUrl.contractController}/deleteContract`, params);
  },
  // 修改合同信息
  verifyContract(params) {
    return axios.post(`${baseUrl.contractController}/verifyContract`, params);
  },
  // 获取合同id迷糊查询列表
  getContractIdsByIdLike(params) {
    return axios.post(`${baseUrl.contractController}/getContractIdsByIdLike`, params);
  },
  // 根据合同id获取节点列表
  getContractNodesByContractId(params) {
    return axios.post(`${baseUrl.contractController}/getContractNodesByContractId`, params);
  },
};

export default contractController;