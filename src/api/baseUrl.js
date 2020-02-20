'use strict';

/**
 * 接口域名的管理
 */
//设置分服务设置服务器地址
const serverBaseUrl = 'http://172.15.67.120:8081/';
const distributeUrl = {
  // 用户信息
  serverBaseController: serverBaseUrl,
  tokensController: serverBaseUrl + 'tokens',
  contractController: serverBaseUrl + 'contract',
  projectCategoryController: serverBaseUrl + 'projectCategory',
  receiptController: serverBaseUrl + 'receipt',
  outContractController: serverBaseUrl + 'outContract',
  outContractCategoryController: serverBaseUrl + 'outContractCategory',
  outProjectCategoryController: serverBaseUrl + 'outProjectCategory',
  cashController: serverBaseUrl + 'cash',
  outPaidController: serverBaseUrl + 'outPaid',
  userController: serverBaseUrl + 'user',
  staffController: serverBaseUrl + 'staff',
  salaryController: serverBaseUrl + 'salary',
  operateRecordController: serverBaseUrl + 'operateRecord',
  memorandumController: serverBaseUrl + 'memorandum'
};

export default distributeUrl;
