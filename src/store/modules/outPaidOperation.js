/*
* Author: zp
* 分包合同付款控制
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
  contractId: '',
  contractName: '',
  designId: '',
  outContractAmount: '',
  outContractId: '',
  outContractName: '',
  outCompanyName: '',
  tableData: [],

};

const mutations = {
  setTableData(state, data) {
    state.paginationProps.total = data.outPaids.totalElements;
    state.contractId = data.contractId;
    state.designId = data.designId;
    state.contractName = data.contractName;
    state.outContractAmount = data.outContractAmount;
    state.outContractId = data.outContractId;
    state.outContractName = data.outContractName;
    state.outCompanyName = data.outCompanyName;
    state.tableData = data.outPaids.content.map((item, index) => {
      return {
        key: index,
        outPaidId: item.outPaidId,
        paidAmount: item.paidAmount,
        paidDate: moment(item.paidDate).format('YYYY-MM-DD HH:mm:ss'),
        paidNote: item.paidNote,
        receipts: item.receipts,
      }
    });
  },
  handleFinalDelete(state, data) {
    const finalPage = Math.ceil(state.paginationProps.total / state.paginationProps.pageSize);
    if (state.tableData.length === data.outPaidIds.length && state.paginationProps.current != 1 && state.paginationProps.current === finalPage) {
      state.paginationProps.current--;
    }
  }
};

const actions = {
  getOutPaidsByOutContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outPaidController.getOutPaidsByOutContractId(params).then(res => {
        res.data.data && commit('setTableData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取分包付款列表失败');
        reject(error);
      });
    });
  },
  deleteOutPaid({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outPaidController.deleteOutPaid(params).then(res => {
        commit('handleFinalDelete', params);
        resolve(res);
      }).catch(error => {
        console.log(error, '删除分包付款失败');
        reject(error);
      });
    });
  },
  addOutPaid({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outPaidController.addOutPaid(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加分包付款失败');
        reject(error);
      });
    });
  },
  verifyOutPaid({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outPaidController.verifyOutPaid(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改分包付款失败');
        reject(error);
      });
    });
  },
  outPaidExport({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outPaidController.outPaidExport(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '分包回款导出失败');
        reject(error);
      });
    });
  },
  outPaidInput({commit}, params) {
    return new Promise((resolve, reject) => {
      api.outPaidController.outPaidInput(params).then(res => {
        resolve(res);
      }).catch(error => {
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