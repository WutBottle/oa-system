<style lang="scss" scoped>
  .StaffPage {
    .page-content {
      padding: 30px;

      .form-wrapper {
        margin-bottom: 18px;
      }
    }
  }
</style>

<template>
  <div class="StaffPage">
    <HeaderPage title="职员列表"/>
    <div class="page-content">
      <a-row style="background-color: #fff; padding: 24px;">
        <a-form class="form-wrapper" :layout="formLayout">
          <a-form-item
                  label="职员名称"
          >
            <a-input v-model="staffName" placeholder="请输入职员名称"/>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleQuery">
              查询
            </a-button>
          </a-form-item>
        </a-form>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="staffColumns" :dataSource="staffTableData"
                     :pagination="staffPaginationProps"
                     @change="handleStaffTableChange" :scroll="{ y: 500}">
              <span slot="operation" slot-scope="text, record">
                    <a @click="openSalary(record)">查看</a>
              </span>
              <a-button slot="export" slot-scope="text, record" type="primary" @click="handleSalaryExport(record)">导出</a-button>
            </a-table>
          </a-spin>
        </div>
      </a-row>
    </div>
    <a-modal
            :title="currentStaffName + '工资详情'"
            v-model="salaryVisible"
            width="700px"
            :footer="null"
    >
      <a-spin :spinning="salaryTableSpinning">
        <a-table bordered :columns="salaryColumns" :dataSource="salaryTableData"
                 :pagination="salaryPaginationProps"
                 @change="handleSalaryTableChange" :scroll="{ y: 500}">
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
        </a-table>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";

  const formLayout = 'inline';
  export default {
    name: "StaffPage",
    components:{
      HeaderPage,
    },
    computed: {
      ...mapState({
        staffTableData: state => state.staffOperation.tableData, // 职员信息数据
        staffPaginationProps: state => state.staffOperation.tablePaginationProps, // 职员信息table的分页
        salaryTableData: state => state.salaryOperation.tableData, // 工资信息数据
        salaryPaginationProps: state => state.salaryOperation.paginationProps, // 工资信息table分页
      }),
    },
    data() {
      return {
        formLayout,
        staffName: '', // 搜索的职员名称
        spinning: false,
        staffColumns: [
          {
            title: '员工号',
            width: '20%',
            key: 'staffCode',
            dataIndex: 'staffCode',
          },
          {
            title: '职员名称',
            width: '20%',
            key: 'staffName',
            dataIndex: 'staffName',
          },
          {
            title: '备注',
            width: '20%',
            key: 'staffNote',
            dataIndex: 'staffNote',
          },
          {
            title: '工资详情',
            width: '20%',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          },
          {
            title: '工资导出',
            width: '20%',
            key: 'export',
            scopedSlots: {customRender: 'export'},
          }
        ],
        currentStaffName: '',
        currentStaffId: '',
        salaryVisible: false,
        salaryTableSpinning: false,
        salaryColumns: [
          {
            title: '序号',
            width: 50,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          },
          {
            title: '合同号',
            width: 150,
            key: 'contractId',
            dataIndex: 'contractId',
          },
          {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
          },
          {
            title: '金额(元)',
            width: 100,
            key: 'money',
            dataIndex: 'money',
          },
        ],
      }
    },
    mounted() {
      this.updateStaffTableData();
    },
    methods: {
      ...mapActions({
        getStaffListByNameLikeTable: 'staffOperation/getStaffListByNameLikeTable', // 获取职员列表
        getSalaryListByStaffId: 'salaryOperation/getSalaryListByStaffId', // 获取职员工资列表
        exportByStaff: 'salaryOperation/exportByStaff', // 导出职员工资
      }),
      handleQuery() {
        this.updateStaffTableData();
      },
      // 选择每页个数
      handleStaffTableChange(pagination) {
        this.staffPaginationProps.current = pagination.current;
        this.staffPaginationProps.pageSize = pagination.pageSize;
        this.updateStaffTableData();
      },
      // 更新职员列表数据
      updateStaffTableData() {
        this.spinning = true;
        const params = {
          staffName: this.staffName,
          pageNum: this.staffPaginationProps.current,
          pageLimit: this.staffPaginationProps.pageSize
        };
        this.getStaffListByNameLikeTable(params).then((data) => {
          this.spinning = false;
        }).catch((error) => {
          this.spinning = false;
          this.$message.error(error);
        });
      },
      handleSalaryExport(data) {
        let fileName = data.staffName + data.staffCode + '.xlsx';
        this.exportByStaff({
          id: data.id,
        }).then((data) => {
          if (!data.data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          this.$message.success("导出成功");
        }).catch((error) => {
          this.$message.error("导出失败");
        });
      },
      openSalary(data) {
        this.currentStaffName = data.staffName;
        this.currentStaffId = data.id;
        this.updateSalaryTableData();
        this.salaryVisible = true;
      },
      // 更新工资列表数据
      updateSalaryTableData() {
        this.salaryTableSpinning = true;
        const params = {
          staffId: this.currentStaffId,
          pageNum: this.staffPaginationProps.current,
          pageLimit: this.staffPaginationProps.pageSize
        };
        this.getSalaryListByStaffId(params).then((data) => {
          this.salaryTableSpinning = false;
        }).catch((error) => {
          this.salaryTableSpinning = false;
          this.$message.error(error);
        });
      },
      handleSalaryTableChange(pagination) {
        this.salaryPaginationProps.current = pagination.current;
        this.salaryPaginationProps.pageSize = pagination.pageSize;
        this.updateSalaryTableData();
      },
    }
  }
</script>