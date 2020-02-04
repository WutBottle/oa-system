/**
 * api接口的统一出口
 */
import userController from './userController';
import contractController from './contractController';
import projectCategoryController from './projectCategoryController';
import receiptController from './receiptController';
import outContractController from './outContractController';
import cashController from './cashController';

// 导出接口
export default {
  userController: userController,// 用户管理
  contractController: contractController,// 合同管理
  projectCategoryController: projectCategoryController, // 项目类型管理
  receiptController: receiptController, // 发票管理
  outContractController: outContractController, // 外包合同管理
  cashController: cashController, // 现金回款管理
}
