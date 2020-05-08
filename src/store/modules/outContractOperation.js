/*
* Author: zp
* 外包合同控制
*/
import api from '@/api/apiSugar'
import moment from 'moment'

const state = {
  paginationProps: {
    pageSize: 5, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '15', '20', '40'], // 每页数量选项
    total: 0,
    current: 1,
  },
  tableData: [],
  contractId: '', // 模糊查询的id
  designId: '',
  contractName: '',
  listTableData: [], // 外包合同列表数据
  listPaginationProps: {
    pageSize: 5, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '10', '15'], // 每页数量选项
    total: 0,
    current: 1,
  },
  selectOutContractInfo: [], // 被选择的合同信息
};

const mutations = {
  setTableData(state, data) {
    state.paginationProps.total = data.outContracts.totalElements;
    state.contractId = data.contractId;
    state.designId = data.designId;
    state.contractName = data.contractName;
    state.tableData = data.outContracts.content.map((item, index) => {
      return {
        key: index,
        outContractId: item.outContractId,
        outContractName: item.outContractName,
        outCompanyName: item.outCompanyName,
        outContractAmount: item.outContractAmount,
        outPaid: item.outPaid,
        outUnpaid: item.outUnpaid,
        ratio: !isNaN(item.ratio) && item.ratio.toFixed(4),
        outContractCategory: item.outContractCategory.categoryName,
        outProjectCategory: item.outProjectCategory.categoryName,
        outContractCategoryId: item.outContractCategory.categoryId,
        outProjectCategoryId: item.outProjectCategory.categoryId,
        outContractDate: moment(item.outContractDate).format('YYYY-MM-DD'),
        note: item.note,
      }
    });
  },
  setListTableData(state, data) {
    state.listPaginationProps.total = data.totalElements;
    state.listTableData = data.content.map((item, index) => {
      return {
        key: index,
        contractId: item.contractId,
        designId: item.designId,
        contractName: item.contractName,
        outContractId: item.outContract.outContractId,
        outContractName: item.outContract.outContractName,
        outCompanyName: item.outContract.outCompanyName,
        outContractAmount: item.outContract.outContractAmount,
        outPaid: item.outContract.outPaid,
        outUnpaid: item.outContract.outUnpaid,
        ratio: !isNaN(item.outContract.ratio) && item.outContract.ratio.toFixed(4),
        outContractCategory: item.outContract.outContractCategory && item.outContract.outContractCategory.categoryName,
        outProjectCategory: item.outContract.outProjectCategory && item.outContract.outProjectCategory.categoryName,
        outContractDate: moment(item.outContract.outContractDate).format('YYYY-MM-DD HH:mm:ss'),
        note: item.outContract.note,
        selectIndex: !!state.selectOutContractInfo.find(value => value.outContractId === item.outContract.outContractId),
      };
    });
  },
  handleFinalDelete(state, data) {
    const finalPage = Math.ceil(state.paginationProps.total / state.paginationProps.pageSize);
    if (state.tableData.length === data.outContractIds.length && state.paginationProps.current != 1 && state.paginationProps.current === finalPage) {
      state.paginationProps.current--;
    }
  },
  addOutContractInfo(state, data) {
    state.selectOutContractInfo.push(data);
  },
  removeOutContractInfo(state, id) {
    state.selectOutContractInfo.splice(state.selectOutContractInfo.findIndex(item => item.outContractId === id), 1);
  },
};

const actions = {
  addOutContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractController.addOutContract(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加外包合同失败');
        reject(error);
      });
    });
  },
  getOutContractListByIdLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractController.getOutContractListByIdLike(params).then(res => {
        res && commit('setListTableData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取外包合同列表失败');
        reject(error);
      });
    });
  },
  getOutContractListBySubId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.subProjectController.getOutContractListBySubId(params).then(res => {
        res.data.data && commit('setTableData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取外包合同列表失败');
        reject(error);
      });
    });
  },
  verifyOutContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractController.verifyOutContract(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改外包合同失败');
        reject(error);
      });
    });
  },
  deleteOutContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractController.deleteOutContract(params).then(res => {
        commit('handleFinalDelete', params);
        resolve(res);
      }).catch(error => {
        console.log(error, '删除外包合同失败');
        reject(error);
      });
    });
  },
  getOutContractIdsByIdLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractController.getOutContractIdsByIdLike(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取外包合同失败');
        reject(error);
      });
    });
  },
  // 导出分包合同
  exportOutContract({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractController.exportOutContract(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '导出分包合同失败');
        reject(error);
      });
    });
  },
  // 分包合同录入
  outContractInput({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outContractController.outContractInput(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '分包合同录入失败');
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
