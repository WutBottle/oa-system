/*
* Author: zp
* 现金回款信息
*/
import api from '@/api/apiSugar'
import moment from 'moment'

const state = {
  cashListPaginationProps: {
    pageSize: 5, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '10', '15'], // 每页数量选项
    total: 0,
    current: 1,
  },
  cashListTableData: [],
  contractId: '',
  designId: '',
  contractName: '',
  selectCashInfo: [],
};

const mutations = {
  setTableData(state, data) {
    state.cashListPaginationProps.total = data.cashes.totalElements;
    state.contractId = data.contractId;
    state.designId = data.designId;
    state.contractName = data.contractName;
    state.cashListTableData = data.cashes.content.map((item, index) => {
      return {
        key: index,
        contractId: data.contractId,
        designId: data.designId,
        contractName: data.contractName,
        cashId: item.cashId,
        cashAmount: item.cashAmount,
        cashDate: moment(item.cashDate).format('YYYY-MM-DD'),
        receipts: item.receipts,
      }
    });
  },
  setTableData2(state, data) {
    state.cashListPaginationProps.total = data.totalElements;
    state.cashListTableData = data.content.map((item, index) => {
      return {
        key: index,
        contractId: item.contractId,
        designId: item.designId,
        contractName: item.contractName,
        cashId: item.cash.cashId,
        cashAmount: item.cash.cashAmount,
        cashDate: moment(item.cash.cashDate).format('YYYY-MM-DD'),
        receipts: item.cash.receipts,
        selectIndex: !!state.selectCashInfo.find(value => value.cashId === item.cash.cashId),
      }
    });
  },
  handleFinalDelete(state, data) {
    const finalPage = Math.ceil(state.cashListPaginationProps.total / state.cashListPaginationProps.pageSize);
    if (state.cashListTableData.length === data.cashIds.length && state.cashListPaginationProps.current != 1 && state.cashListPaginationProps.current === finalPage) {
      state.cashListPaginationProps.current--;
    }
  }
};

const actions = {
  // 根据合同id获取现金回款
  getCashesByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.getCashesByContractId(params).then(res => {
        if (params.hasOwnProperty('pageNum') && params.hasOwnProperty('pageLimit')) {
          res.data.data && commit('setTableData', res.data.data);
        }
        resolve(res);
      }).catch(error => {
        console.log(error, '获取现金回款失败');
        reject(error);
      });
    });
  },
  // 新增现金回款
  addCash({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.addCash(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取现金回款失败');
        reject(error);
      });
    });
  },
  // 删除现金回款
  deleteCash({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.deleteCash(params).then(res => {
        commit('handleFinalDelete', params)
        resolve(res);
      }).catch(error => {
        console.log(error, '删除现金回款失败');
        reject(error);
      });
    });
  },
  // 修改现金回款
  verifyCash({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.verifyCash(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改现金回款失败');
        reject(error);
      });
    });
  },
  // 合同现金发票导出
  cashExport({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.cashExport(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '现金发票导出失败');
        reject(error);
      });
    });
  },
  // 现金发票导入
  cashInput({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.cashInput(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '现金导入失败');
        reject(error);
      });
    });
  },
  getRecentCashes({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.getRecentCashes(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取现金失败');
        reject(error);
      });
    });
  },
  getCashesByIdLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.getCashesByIdLike(params).then(res => {
        if (params.hasOwnProperty('pageNum') && params.hasOwnProperty('pageLimit')) {
          res && commit('setTableData2', res.data.data);
        }
        resolve(res);
      }).catch(error => {
        console.log(error, '获取现金回款失败');
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