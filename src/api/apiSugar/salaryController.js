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
  }
;

export default salaryController;