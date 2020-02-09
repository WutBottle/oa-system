/*
* Author: zp
* 合同信息
*/
import api from '@/api/apiSugar'
import moment from 'moment'

const state = {
  selectedRowKeys: [], // 选中的keys
  paginationProps: {
    pageSize: 10, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '15', '20'], // 每页数量选项
    total: 0,
    current: 1,
  },
  projectCategoryList: [], // 拉取的项目类型
  tableData: [],
  selectContractInfo: [], // 被选中的合同数据
  totalColumns: [
    {
      title: '合同号',
      width: 100,
      key: 'contractNum',
      dataIndex: 'contractNum',
      sort: 1,
    },
    {
      title: '签约状态',
      width: 100,
      dataIndex: 'signState',
      sort: 2,
      key: 'signState',
      scopedSlots: {customRender: 'signState'}
    },
    {
      title: '设计号',
      width: 120,
      key: 'designNum',
      dataIndex: 'designNum',
      sort: 3,
    },
    {
      title: '发包人合同编号',
      width: 150,
      key: 'employerContractNum',
      dataIndex: 'employerContractNum',
      sort: 4,
    },
    {
      title: '合同名称',
      width: 150,
      key: 'contractName',
      dataIndex: 'contractName',
      sort: 5,
    },
    {
      title: '合同节点',
      width: 200,
      key: 'contractNodes',
      dataIndex: 'contractNodes',
      sort: 6,
      scopedSlots: {customRender: 'contractNodes'}
    },
    {
      title: '合同额(元)',
      width: 150,
      key: 'contractAmount',
      dataIndex: 'contractAmount',
      sort: 7,
      sorter: (a, b) => a.contractAmount - b.contractAmount,
    },
    {
      title: '累计现金回款(元)',
      width: 150,
      key: 'accumulatedCashReceipts',
      sort: 8,
      dataIndex: 'accumulatedCashReceipts',
    },
    {
      title: '剩余合同额(元)',
      width: 150,
      key: 'remainingContractAmount',
      dataIndex: 'remainingContractAmount',
      sort: 9,
    },
    {
      title: '已收款比例',
      width: 130,
      key: 'receivedProportion',
      dataIndex: 'receivedProportion',
      sort: 10,
    },
    {
      title: '累计开票金额(元)',
      width: 150,
      key: 'cumulativeInvoicedAmount',
      dataIndex: 'cumulativeInvoicedAmount',
      sort: 11,
    },
    {
      title: '已开发票未收款金额',
      width: 160,
      key: 'invoicedUncollectedAmount',
      dataIndex: 'invoicedUncollectedAmount',
      sort: 12,
    },
    {
      title: '实际签约日期',
      width: 150,
      key: 'actualSigningDate',
      dataIndex: 'actualSigningDate',
      sort: 13,
    },
    {
      title: '合同归档日期',
      width: 150,
      key: 'contractFilingDate',
      dataIndex: 'contractFilingDate',
      sort: 14,
    },
    {
      title: '项目类别',
      width: 300,
      key: 'itemCategory',
      dataIndex: 'itemCategory',
      sort: 15,
      scopedSlots: {customRender: 'itemCategory'}
    },
    {
      title: '主设计部门',
      width: 150,
      key: 'mainDesignDepartment',
      dataIndex: 'mainDesignDepartment',
      sort: 16,
    },
    {
      title: '经营部门',
      width: 150,
      key: 'managementDepartment',
      dataIndex: 'managementDepartment',
      sort: 17,
    },
    {
      title: '项目经理',
      width: 150,
      key: 'projectManager',
      dataIndex: 'projectManager',
      sort: 18,
    },
    {
      title: '经营经理',
      width: 150,
      key: 'runningManager',
      dataIndex: 'runningManager',
      sort: 19,
    },
    {
      title: '项目预算秘书',
      width: 150,
      key: 'projectSecretary',
      dataIndex: 'projectSecretary',
      sort: 20,
    },
    {
      title: '发包方',
      width: 150,
      key: 'contractingParty',
      dataIndex: 'contractingParty',
      sort: 21,
    },
    {
      title: '投资额(万元)',
      width: 150,
      key: 'investmentAmount',
      dataIndex: 'investmentAmount',
      sort: 22,
    },
    {
      title: '项目规模(平方米)',
      width: 150,
      key: 'projectScale',
      dataIndex: 'projectScale',
      sort: 23,
    },
    {
      title: '地域',
      width: 150,
      key: 'region',
      dataIndex: 'region',
      sort: 24,
    },
    {
      title: '地区关键词',
      width: 150,
      key: 'regionalKeyWords',
      dataIndex: 'regionalKeyWords',
      sort: 25,
    },
    {
      title: '建筑一级分类',
      width: 120,
      key: 'class1',
      dataIndex: 'class1',
      sort: 26,
    },
    {
      title: '建筑二级分类',
      width: 120,
      key: 'class2',
      dataIndex: 'class2',
      sort: 27,
    },
    {
      title: '是否EPC项目',
      width: 120,
      key: 'epc',
      dataIndex: 'epc',
      sort: 28,
      scopedSlots: {customRender: 'epc'}
    },
    {
      width: 150,
      title: '合同扫描文件',
      key: 'contractFile',
      dataIndex: 'contractFile',
      sort: 29,
      scopedSlots: {customRender: 'contractFile'}
    },
    {
      title: '序号',
      width: 70,
      fixed: 'left',
      dataIndex: 'serial',
      key: 'serial',
      sort: 0,
      scopedSlots: {customRender: 'serial'}
    },
    {
      width: 150,
      title: '合同操作',
      fixed: 'right',
      key: 'selectIndex',
      dataIndex: 'selectIndex',
      sort: 31,
      scopedSlots: {customRender: 'selectIndex'}
    },
  ], // 表单配置的全部数据
  options: [], // 表头总数据
  defaultOptions: [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 28], // 默认出现的表头
};

const mutations = {
  setSelectedRowKeys(state, data) {
    state.selectedRowKeys = data;
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
        remainingContractAmount: item.contractRemain, // 剩余合同额(元)
        receivedProportion: item.ratio, // 已收款比例
        cumulativeInvoicedAmount: item.receiptAmount, // 累计开票金额(元)
        invoicedUncollectedAmount: item.receiptNotCash, // 已开发票未收款金额
        actualSigningDate: moment(item.actualDate).format('YYYY-MM-DD HH:mm:ss'), // 实际签约日期
        contractFilingDate: moment(item.contractDate).format('YYYY-MM-DD HH:mm:ss'), // 合同归档日期
        itemCategory: !item.projectCategory ? '' : item.projectCategory.projectCategoryName, // 项目类别
        mainDesignDepartment: item.departmentDesign, // 主设计部门
        managementDepartment: item.departmentRunning, // 经营部门
        projectManager: item.projectManager, // 项目经理
        runningManager: item.runningManager, // 经营经理
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
          contractId: item.contractFile ?  item.contractId: '',
        }, // 合同扫描文件
        selectIndex: !!state.selectContractInfo.find(value => value.contractId === item.contractId),
      }
    });
  },
  setProjectCategoryList(state, data) {
    state.projectCategoryList = data;
  },
  handleFinalDelete(state, data) {
    const finalPage = Math.ceil(state.paginationProps.total / state.paginationProps.pageSize);
    if (state.tableData.length === data.contractIds.length && state.paginationProps.current != 1 && state.paginationProps.current === finalPage) {
      state.paginationProps.current--;
    }
  },
  addContractInfo(state, data) {
    state.selectContractInfo.push(data);
  },
  removeContractInfo(state, id) {
    state.selectContractInfo.splice(state.selectContractInfo.findIndex(item => item.contractId === id), 1);
  },
  loadSettingOptions(state) {
    state.options = state.totalColumns.filter(item => !item.fixed).map((item, index) => {
      return {
        label: item.title,
        value: index,
      }
    });
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
  // 批量删除合同信息
  deleteContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.deleteContract(params).then(res => {
        commit('handleFinalDelete', params);
        resolve(res);
      }).catch(error => {
        console.log(error, '删除失败');
        reject(error);
      });
    });
  },
  // 修改合同信息
  verifyContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.verifyContract(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改失败');
        reject(error);
      });
    });
  },
  // 获取合同id迷糊查询列表
  getContractIdsByIdLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.getContractIdsByIdLike(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取失败');
        reject(error);
      });
    });
  },
  // 根据合同id获取节点列表
  getContractNodesByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.getContractNodesByContractId(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取节点列表失败');
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
