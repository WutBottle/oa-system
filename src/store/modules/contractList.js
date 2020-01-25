/*
* Author: zp
* 合同信息
*/
import api from '@/api/apiSugar'
import moment from 'moment'

const state = {
  countNum: 0,
  totalMoney: 0,
  selectedRowKeys: [], // 选中的keys
  paginationProps: {
    pageSize: 1, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['1', '5', '10'], // 每页数量选项
    total: 0,
    current: 1,
  },
  projectCategoryList: [],
  tableData: [],
};

const mutations = {
  setSelectedRowKeys(state, data) {
    state.selectedRowKeys = data;
    state.countNum = data.length;
    let tempMoney = 0;
    data.forEach((item) => {
      tempMoney += state.tableData[item].contractAmount;
    });
    state.totalMoney = tempMoney;
  },
  setPageInfo(state, data) {
    state.paginationProps.total = data.totalElements;
    state.tableData = data.content.map((item, index) => {
      return {
        key: index,
        contractNum: item.contractId, // 合同号
        signState: item.sign, // 签约状态
        designNum: item.designId, // 设计号
        employerContractNum: item.ownerId, // 发包人合同编号
        contractName: item.contractName, // 合同名称
        contractNodes: item.contractNodes, // 合同节点
        contractAmount: item.contractAmount, // 合同额(元)
        accumulatedCashReceipts: item.cashAmount, // 累计现金回款(元)
        remainingContractAmount: item.receiptRemain, // 剩余合同额(元)
        receivedProportion: item.ratio, // 已收款比例
        cumulativeInvoicedAmount: item.receiptAmount, // 累计开票金额(元)
        invoicedUncollectedAmount: item.receiptNotCash, // 已开发票未收款金额
        actualSigningDate: moment(item.actualDate).format('YYYY-MM-DD HH:mm:ss'), // 实际签约日期
        contractFilingDate: moment(item.contractDate).format('YYYY-MM-DD HH:mm:ss'), // 合同归档日期
        itemCategory: item.projectCategories, // 项目类别
        mainDesignDepartment: item.departmentDesign, // 主设计部门
        managementDepartment: item.departmentRunning, // 经营部门
        projectManager: item.projectManager, // 项目经理
        projectSecretary: item.projectSecretary, // 项目预算秘书
        contractingParty: item.owner, // 发包方
        investmentAmount: item.investment, // 投资额(万元)
        projectScale: item.scale, // 项目规模(平方米)
        region: item.region ? '省内' : '省外', // 地域
        regionalKeyWords: item.district, // 地区关键词
        class1: item.buildOne, // 建筑一级分类
        class2: item.buildTwo, // 建筑二级分类
        epc: item.epc, // 是否EPC项目
        contractFile: {
          isDownload: false,
          contractId: item.contractId
        }, // 合同扫描文件
      }
    });
  },
  setProjectCategoryList(state, data) {
    state.projectCategoryList = data;
  }
};

const actions = {
  // 下载合同文件
  downloadContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.downloadContract(params)
        .then(res => {
          resolve(res);
        }).catch(error => {
        console.log(error, '合同文件下载失败');
        reject(error);
      });
    });
  },
  // 合同号模糊查询
  getContractListById({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.getContractListById(params).then(res => {
        commit('setPageInfo', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取合同信息失败');
        reject(error);
      });
    });
  },
  // 导出合同文件
  exportContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.exportContract(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '导出合同失败');
        reject(error);
      });
    });
  },
  // 添加合同信息
  addContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.addContract(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加合同信息失败');
        reject(error);
      });
    });
  },
  // 上传合同扫描文件
  uploadContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.uploadContract(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '上传合同扫描文件失败');
        reject(error);
      });
    });
  },
  // 获取项目类型列表
  getProjectCategoryList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.projectCategoryController.getProjectCategoryList(params).then(res => {
        commit('setProjectCategoryList', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取项目类型失败');
        reject(error);
      });
    });
  },
  // 上传合同录入excel信息
  contractInput({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.contractInput(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '上传文件失败');
        reject(error);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
