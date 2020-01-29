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
    pageSizeOptions: ['10', '15', '20'], // 每页数量选项
    total: 0,
    current: 1,
  },
  tableData: [],
};

const mutations = {
  setTableData(state, data) {
    state.paginationProps.total = data.receipts.totalElements;
    state.tableData = data.receipts.content.map((item, index) => {
      return {
        key: index,
        receiptId: item.receiptId,
        receiptFile: item.receiptFile,
        receiptAmount: item.receiptAmount,
        receiptClass: item.receiptClass ? '增值税专用发票' : '增值税普通发票',
        receiptDate: moment(item.receiptDate).format('YYYY-MM-DD HH:mm:ss'),
        contractId: data.contractId,
        designId: data.designId,
        contractName: data.contractName
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
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
