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
  selectReceiptInfo: [],
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
        id: item.receipt.id,
        receiptId: item.receipt.receiptId,
        receiptFile: item.receipt.receiptFile,
        receiptAmount: item.receipt.receiptAmount,
        receiptClass: item.receipt.receiptClass ? '增值税专用发票' : '增值税普通发票',
        receiptDate: moment(item.receipt.receiptDate).format('YYYY-MM-DD'),
        selectIndex: !!state.selectReceiptInfo.find(value => value.id === item.receipt.id),
      }
    });
  },
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
        res && commit('setReceiptListData', res.data.data);
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
  getReceiptsByOutContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.getReceiptsByOutContractId(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取分包发票信息失败');
        reject(error);
      });
    });
  },
  addOutReceipt({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.addOutReceipt(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加分包发票信息失败');
        reject(error);
      });
    });
  },
  verifyOutReceipt({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.verifyOutReceipt(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改分包发票信息失败');
        reject(error);
      });
    });
  },
  deleteOutReceipt({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.deleteOutReceipt(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除分包发票信息失败');
        reject(error);
      });
    });
  },
  // 发票导出
  receiptExport({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.receiptExport(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '发票导出失败');
        reject(error);
      });
    });
  },
  // 发票导入
  receiptInput({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.receiptInput(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '发票导入失败');
        reject(error);
      });
    });
  },
  // 分包发票导入
  outInput({commit}, params) {
    return new Promise((resolve, reject) => {
      api.receiptController.outInput(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '分包发票导入失败');
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
