/*
* Author: zp
* 发票控制
*/
import api from '@/api/apiSugar'
import moment from 'moment'

const state = {
  receiptListData: [], // 发票列表数据
  receiptPaginationProps: {
    pageSize: 5, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '10', '15'], // 每页数量选项
    total: 0,
    current: 1,
  },
};

const mutations = {
  setReceiptListData(state, data) {
    state.receiptPaginationProps.total = data.totalElements;
    state.receiptListData = data.content.map((item, index) => {
      return {
        key: index,
        contractId: item.contractId,
        designId: item.designId,
        contractName: item.contractName,
        receiptId: item.receipt.receiptId,
        receiptFile: item.receipt.receiptFile,
        receiptAmount: item.receipt.receiptAmount,
        receiptClass: item.receipt.receiptClass ? '增值税专用发票' : '增值税普通发票',
        receiptDate: moment(item.receipt.receiptDate).format('YYYY-MM-DD HH:mm:ss'),
      }
    });
  },
  handleFinalDelete(state, data) {
    const finalPage = Math.ceil(state.paginationProps.total / state.paginationProps.pageSize);
    if (state.tableData.length === data.receiptIds.length && state.paginationProps.current != 1 && state.paginationProps.current === finalPage) {
      state.paginationProps.current--;
    }
  }
};

const actions = {
  getReceiptsByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.getReceiptsByContractId(params).then(res => {
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
        console.log(error, '添加发票失败');
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
        commit('handleFinalDelete', params);
        resolve(res);
      }).catch(error => {
        console.log(error, '删除发票信息失败');
        reject(error);
      });
    });
  },
  getReceiptListByIdLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.getReceiptListByIdLike(params).then(res => {
        commit('setReceiptListData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取发票信息失败');
        reject(error);
      });
    });
  },
  receiptUpload({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.receiptUpload(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '上传发票信息失败');
        reject(error);
      });
    });
  },
  getRecentReceipts({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.getRecentReceipts(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取发票信息失败');
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
