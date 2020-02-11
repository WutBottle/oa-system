/*
* Author: zp
* 工资处理
*/
import api from '@/api/apiSugar'
import moment from "moment";

const state = {
  tableData: [],
  paginationProps: {
    pageSize: 5, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '10', '15'], // 每页数量选项
    total: 0,
    current: 1,
  },
};

const mutations = {
  setTableData(state, data) {
    state.paginationProps.total = data.totalElements;
    state.tableData = data.content.map((item, index) => {
      return {
        key: index,
        money: item.money,
        contractId: item.contractId,
        contractName: item.contractName,
      }
    });
  },
};

const actions = {
  // 根据职员id获取工资
  getSalaryListByStaffId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.salaryController.getSalaryListByStaffId(params).then(res => {
        res.data.data && commit('setTableData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取职员工资失败');
        reject(error);
      });
    })
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
