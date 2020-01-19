/**
 * api接口的统一出口
 */
import userController from './userController';
import contractController from './contractController';

// 导出接口
export default {
  userController: userController,// 用户管理
  contractController: contractController,// 合同管理
}
