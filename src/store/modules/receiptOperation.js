/*
* Author: zp
* 发票控制
*/
import api from '@/api/apiSugar'
import moment from 'moment'

const state = {
  paginationProps: {
    pageSize: 5, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '10', '15'], // 每页数量选项
    total: 0,
    current: 1,
  },
  tableData: [],
  contractId: '',
  designId: '',
  contractName: '',
};

const mutations = {
  setTableData(state, data) {
    state.paginationProps.total = data.receipts.totalElements;
    state.contractId = data.contractId;
    state.designId = data.designId;
    state.contractName = data.contractName;
    state.tableData = data.receipts.content.map((item, index) => {
      return {
        key: index,
        receiptId: item.receiptId,
        receiptFile: item.receiptFile,
        receiptAmount: item.receiptAmount,
        receiptClass: item.receiptClass,
        receiptDate: moment(item.receiptDate).format('YYYY-MM-DD HH:mm:ss'),
      }
    });
  },

};

const actions = {
  getReceiptsByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.getReceiptsByContractId(params).then(res => {
        commit('setTableData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取发票列表信息失败');
        reject(error);
      });
    });
  },
  addReceipt({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.addReceipt(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取发票列表信息失败');
        reject(error);
      });
    });
  },
  verifyReceipt({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.verifyReceipt(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改发票信息失败');
        reject(error);
      });
    });
  },
  deleteReceipt({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.deleteReceipt(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除发票信息失败');
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
