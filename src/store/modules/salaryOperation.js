/*
* Author: zp
* 工资处理
*/
import api from '@/api/apiSugar'

const state = {
  tableData: [],
  paginationProps: {
    pageSize: 5, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '10', '15'], // 每页数量选项
    total: 0,
    current: 1,
  },
  entryTableData: [],
  entryPaginationProps: {
    pageSize: 5, // 默认每页显示数量
    showSizeChanger: true, // 显示可改变每页数量
    pageSizeOptions: ['5', '10', '15'], // 每页数量选项
    total: 0,
    current: 1,
  },
  contractId: '',
  designId: '',
  contractName: '',
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
  setEntryTableData(state, data) {
    state.entryPaginationProps.total = data.salaries.totalElements;
    state.contractId = data.contractId;
    state.designId = data.designId;
    state.contractName = data.contractName;
    state.entryTableData = data.salaries.content.map((item, index) => {
      return {
        key: index,
        id: item.id,
        money: item.money,
        staffName: item.staff.staffName,
        staffId: item.staff.staffId,
        staffCode: item.staff.staffCode,
        staffNote: item.staff.staffNote,
      }
    });
  },
  handleFinalDelete(state, data) {
    const finalPage = Math.ceil(state.entryPaginationProps.total / state.entryPaginationProps.pageSize);
    if (state.entryTableData.length === 1 && state.entryPaginationProps.current != 1 && state.entryPaginationProps.current === finalPage) {
      state.entryPaginationProps.current--;
    }
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
  },
  // 根据合同id获取工资信息
  getSalaryListByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.salaryController.getSalaryListByContractId(params).then(res => {
        res.data.data && commit('setEntryTableData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取合同工资失败');
        reject(error);
      });
    })
  },
  // 添加工资信息
  addSalary({commit}, params) {
    return new Promise((resolve, reject) => {
      api.salaryController.addSalary(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加工资信息失败');
        reject(error);
      });
    })
  },
  // 删除工资信息
  deleteSalary({commit}, params) {
    return new Promise((resolve, reject) => {
      api.salaryController.deleteSalary(params).then(res => {
        commit('handleFinalDelete', params);
        resolve(res);
      }).catch(error => {
        console.log(error, '删除工资信息失败');
        reject(error);
      });
    })
  },
  // 修改工资信息
  verifySalary({commit}, params) {
    return new Promise((resolve, reject) => {
      api.salaryController.verifySalary(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改工资信息失败');
        reject(error);
      });
    })
  },
  // 导出员工工资
  exportByStaff({commit}, params) {
    return new Promise((resolve, reject) => {
      api.salaryController.exportByStaff(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '导出工资信息失败');
        reject(error);
      });
    })
  },
  // 根据项目id导出员工工资
  exportByProject({commit}, params) {
    return new Promise((resolve, reject) => {
      api.salaryController.exportByProject(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '导出工资信息失败');
        reject(error);
      });
    })
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
