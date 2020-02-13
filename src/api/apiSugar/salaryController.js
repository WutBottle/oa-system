/*
 * 工资控制
 * By ZP
 */

'use strict';
import axios from '../axiosServices';
import baseUrl from '../baseUrl'; // 导入接口域名列表

const salaryController = {
  // 根据职员id获取工资
  getSalaryListByStaffId(params) {
    return axios.post(`${baseUrl.salaryController}/getSalaryListByStaffId`, params);
  },
  // 根据合同id获取工资信息
  getSalaryListByContractId(params) {
    return axios.post(`${baseUrl.salaryController}/getSalaryListByContractId`, params);
  },
  // 添加工资信息
  addSalary(params) {
    return axios.post(`${baseUrl.salaryController}/addSalary`, params);
  },
  // 删除工资信息
  deleteSalary(params) {
    return axios.post(`${baseUrl.salaryController}/deleteSalary`, params);
  },
  // 修改工资信息
  verifySalary(params) {
    return axios.post(`${baseUrl.salaryController}/verifySalary`, params);
  },
  // 导出员工工资信息
  exportByStaff(params) {
    return axios.post(`${baseUrl.salaryController}/exportByStaff`, params, {
      responseType: 'blob'
    });
  },
};

export default salaryController;