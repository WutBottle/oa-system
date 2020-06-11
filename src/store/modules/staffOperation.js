/*
* Author: zp
* 职员管理
*/
import api from '@/api/apiSugar'

const state = {
  staffData: [],
  paginationProps: {
    pageSize: 6, // 默认每页显示数量
    current: 1,
  },
};

const mutations = {
  setStaffData(state, data){
    state.staffData = data.content;
  },
};

const actions = {
  // 获取职员列表(模糊查询)
  getStaffListByNameLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.getStaffListByNameLike(params).then(res => {
        res.data.data && commit('setStaffData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取职员列表失败');
        reject(error);
      });
    });
  },
  // 获取职员列表(table展示)
  getStaffListByNameLikeTable({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.getStaffListByNameLike(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取职员列表失败');
        reject(error);
      });
    });
  },
  // 添加职员信息
  addStaff({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.addStaff(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '添加职员信息失败');
        reject(error);
      });
    });
  },
  // 添加职员信息
  deleteStaff({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.deleteStaff(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '删除职员信息失败');
        reject(error);
      });
    });
  },
  // 添加职员信息
  verifyStaff({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.verifyStaff(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '修改职员信息失败');
        reject(error);
      });
    });
  },
  // 根据合同id获取工资信息
  getSalaryListByContractId({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.getSalaryListByContractId(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '获取工资信息失败');
        reject(error);
      });
    });
  },
  // 职员信息导出
  staffExport({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.staffExport(params).then(res => {
        resolve(res);
      }).catch(error => {
        console.log(error, '导出职员信息失败');
        reject(error);
      });
    });
  },
  getStaffNamesByNameLike({commit}, params) {
    return new Promise((resolve, reject) => {
      api.staffController.getStaffNamesByNameLike(params).then(res => {
        res.data.data && commit('setStaffData', res.data.data);
        resolve(res);
      }).catch(error => {
        console.log(error, '获取职员列表失败');
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
