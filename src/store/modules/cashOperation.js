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
        cashId: item.cashId,
        cashAmount: item.cashAmount,
        cashDate: moment(item.cashDate).format('YYYY-MM-DD HH:mm:ss'),
        nodeInfo: item.nodeInfo.nodeId,
        nodeName: item.nodeInfo.nodeDescription,
      }
    });
  },
};

const actions = {
  // 根据合同id获取现金回款
  getCashesByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.cashController.getCashesByContractId(params).then(res => {
        commit('setTableData', res.data.data);
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
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}