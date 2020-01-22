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
    pageSize: 2, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['10', '20', '30', '40'], // 每页数量选项
    total: 0,
    current: 1,
  },
  tableData: [],
};

const mutations = {
  setSelectedRowKeys(state, data) {
    console.log(data)
    state.selectedRowKeys = data;
    state.countNum = data.length;
    let tempMoney = 0;
    data.forEach((item) => {
      tempMoney += state.tableData[item].contractAmount;
    });
    state.totalMoney = tempMoney;
  },
  setPageInfo(state, data) {
    state.paginationProps.total = data.totalPages;
    state.tableData = data.content.map((item, index) => {
      return {
        key: index,
        contractNum: item.contractId, // 合同号
        signState: item.sign, // 签约状态
        designNum: item.designId, // 设计号
        employerContractNum: item.ownerId, // 发包人合同编号
        contractName: item.contractName, // 合同名称
        contractNode: item.contractNode, // 合同节点
        contractAmount: item.contractAmount, // 合同额(元)
        accumulatedCashReceipts: '', // 累计现金回款(元)
        remainingContractAmount: '', // 剩余合同额(元)
        receivedProportion: '', // 已收款比例
        cumulativeInvoicedAmount: '', // 累计开票金额(元)
        invoicedUncollectedAmount: '', // 已开发票未收款金额
        actualSigningDate: '', // 实际签约日期
        contractFilingDate: moment(item.contractDate).format('YYYY-MM-DD HH:mm:ss'), // 合同归档日期
        itemCategory: '', // 项目类别
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
        contractFile: item.contractFile, // 合同扫描文件
      }
    });
  }
};

const actions = {
  getContractList({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.getContractList(params)
        .then(res => {
          commit('setPageInfo', res.data.data);
          resolve(res);
        }).catch(error => {
        console.log(error, '获取合同信息失败');
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
