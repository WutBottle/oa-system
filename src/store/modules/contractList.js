/*
* Author: zp
* 合同信息
*/
import api from '@/api/apiSugar'

const state = {
  totalColumns: [
    {
      title: '签约状态',
      width: 100,
      dataIndex: 'signState',
      sort: 1,
      key: 'signState',
      scopedSlots: {customRender: 'signState'}
    },
    {
      title: '设计号',
      width: 120,
      key: 'designNum',
      dataIndex: 'designNum',
      sort: 2,
    },
    {
      title: '合同号',
      width: 100,
      key: 'contractNum',
      dataIndex: 'contractNum',
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
      width: 150,
      title: '合同扫描文件',
      key: 'contractFile',
      dataIndex: 'contractFile',
      sort: 6,
      scopedSlots: {customRender: 'contractFile'}
    },
    {
      title: '合同节点',
      width: 200,
      key: 'contractNodes',
      dataIndex: 'contractNodes',
      sort: 7,
      scopedSlots: {customRender: 'contractNodes'}
    },
    {
      title: '合同额(元)',
      width: 150,
      key: 'contractAmount',
      dataIndex: 'contractAmount',
      sort: 8,
      sorter: (a, b) => a.contractAmount - b.contractAmount,
    },
    {
      title: '累计现金回款(元)',
      width: 150,
      key: 'accumulatedCashReceipts',
      sort: 9,
      dataIndex: 'accumulatedCashReceipts',
    },
    {
      title: '剩余合同额(元)',
      width: 150,
      key: 'remainingContractAmount',
      dataIndex: 'remainingContractAmount',
      sort: 10,
    },
    {
      title: '已收款比例',
      width: 130,
      key: 'receivedProportion',
      dataIndex: 'receivedProportion',
      sort: 11,
    },
    {
      title: '累计开票金额(元)',
      width: 150,
      key: 'cumulativeInvoicedAmount',
      dataIndex: 'cumulativeInvoicedAmount',
      sort: 12,
    },
    {
      title: '已开发票未收款金额',
      width: 160,
      key: 'invoicedUncollectedAmount',
      dataIndex: 'invoicedUncollectedAmount',
      sort: 13,
    },
    {
      title: '实际签约日期',
      width: 150,
      key: 'actualSigningDate',
      dataIndex: 'actualSigningDate',
      sort: 14,
    },
    {
      title: '合同归档日期',
      width: 150,
      key: 'contractFilingDate',
      dataIndex: 'contractFilingDate',
      sort: 15,
    },
    {
      title: '项目类别',
      width: 300,
      key: 'itemCategory',
      dataIndex: 'itemCategory',
      sort: 16,
      scopedSlots: {customRender: 'itemCategory'}
    },
    {
      title: '主设计部门',
      width: 150,
      key: 'mainDesignDepartment',
      dataIndex: 'mainDesignDepartment',
      sort: 17,
    },
    {
      title: '经营部门',
      width: 150,
      key: 'managementDepartment',
      dataIndex: 'managementDepartment',
      sort: 18,
    },
    {
      title: '项目经理',
      width: 150,
      key: 'projectManager',
      dataIndex: 'projectManager',
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
      title: '经营经理',
      width: 150,
      key: 'runningManager',
      dataIndex: 'runningManager',
      sort: 21,
    },
    {
      title: '发包方',
      width: 150,
      key: 'contractingParty',
      dataIndex: 'contractingParty',
      sort: 22,
    },
    {
      title: '投资额(万元)',
      width: 150,
      key: 'investmentAmount',
      dataIndex: 'investmentAmount',
      sort: 23,
    },
    {
      title: '项目规模(平方米)',
      width: 150,
      key: 'projectScale',
      dataIndex: 'projectScale',
      sort: 24,
    },
    {
      title: '地域',
      width: 150,
      key: 'region',
      dataIndex: 'region',
      sort: 25,
    },
    {
      title: '地区关键词',
      width: 150,
      key: 'regionalKeyWords',
      dataIndex: 'regionalKeyWords',
      sort: 26,
    },
    {
      title: '建筑一级分类',
      width: 120,
      key: 'class1',
      dataIndex: 'class1',
      sort: 27,
    },
    {
      title: '建筑二级分类',
      width: 120,
      key: 'class2',
      dataIndex: 'class2',
      sort: 28,
    },
    {
      title: '是否EPC项目',
      width: 120,
      key: 'epc',
      dataIndex: 'epc',
      sort: 29,
      scopedSlots: {customRender: 'epc'}
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
      width: 120,
      title: '合同操作',
      fixed: 'right',
      key: 'operation',
      dataIndex: 'operation',
      sort: 30,
      scopedSlots: {customRender: 'operation'}
    },
  ], // 表单配置的全部数据
  options: [], // 表头总数据
  defaultOptions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 28], // 默认出现的表头
};

const mutations = {
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
  getContractListByIdLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.getContractListByIdLike(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取合同信息失败');
        reject(error);
      });
    });
  },
  // 精确查找
  getContractListByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.getContractListByContractId(params).then(res => {
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
  // 根据合同号获取项目列表
  getProjectListByIdLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.contractController.getProjectListByIdLike(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取项目列表失败');
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
