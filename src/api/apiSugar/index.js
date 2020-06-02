/**
 * api接口的统一出口
 */
import tokensController from './tokensController';
import contractController from './contractController';
import projectCategoryController from './projectCategoryController';
import receiptController from './receiptController';
import outContractController from './outContractController';
import cashController from './cashController';
import outPaidController from './outPaidController';
import userController from './userController';
import staffController from "./staffController";
import salaryController from "./salaryController";
import outContractCategoryController from "./outContractCategoryController";
import outProjectCategoryController from "./outProjectCategoryController";
import operateRecordController from "./operateRecordController";
import memorandumController from "./memorandumController";
import categoryController from "./categoryController";
import subProjectController from "./subProjectController";
import roleController from "./roleController";
import projectUserController from "./projectUserController";
import projectCirculationController from "./projectCirculationController";
import assignmentController from "./assignmentController";

// 导出接口
export default {
  tokensController: tokensController,// 登录管理
  contractController: contractController,// 合同管理
  projectCategoryController: projectCategoryController, // 项目类型管理
  receiptController: receiptController, // 发票管理
  outContractController: outContractController, // 外包合同管理
  cashController: cashController, // 现金回款管理
  outPaidController: outPaidController, // 分包付款管理
  userController: userController, // 用户管理
  staffController: staffController, // 职员管理
  salaryController: salaryController, // 工资管理
  outContractCategoryController: outContractCategoryController, // 分包类型管理
  outProjectCategoryController: outProjectCategoryController, // 分包项目类型
  operateRecordController: operateRecordController, // 主页动态
  memorandumController: memorandumController, // 备忘录
  categoryController: categoryController, // 类型控制
  subProjectController: subProjectController, // 分项控制
  roleController: roleController, // 角色控制
  projectUserController: projectUserController, // 项目角色分配控制
  projectCirculationController: projectCirculationController, // 审核控制
  assignmentController: assignmentController, // 任务控制
}
