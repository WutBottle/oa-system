<style lang="scss" scoped>
  .ProjectListPage {
    .form-wrapper {
      margin-bottom: 18px;
    }
  }
</style>

<template>
  <div class="ProjectListPage">
    <a-form class="form-wrapper" :layout="formLayout">
      <a-form-item
              label="项目合同号"
      >
        <a-input style="width: 140px" v-model="contractId" placeholder="请输入合同号"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleQuery">
          查询
        </a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-spin :spinning="spinning" tip="Loading...">
        <a-table bordered :columns="columns" :dataSource="tableData"
                 :pagination="paginationProps"
                 @change="handleTableChange" :scroll="{ x: 2760, y: 550}">
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="isSign" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
          </span>
          <template slot="selectIndex" slot-scope="text, record">
            <a-button type="primary" size="small" @click="handleOpen(record)">
              查看
            </a-button>
            <a-divider type="vertical"/>
            <a-dropdown :trigger="['click']">
              <a-button icon="down" type="primary" size="small">
                导出
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a-button type="primary" size="small" @click="handleCashExport(record)">
                    现金发票
                  </a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
          <a-progress slot="ratio" slot-scope="text" type="circle" :percent="text" :width="60" />
          <a slot="projectSalary" slot-scope="text, record" @click="handleOpenSalary(record)">查看工资</a>
        </a-table>
      </a-spin>
    </div>
    <a-modal
            title="工资详情"
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
    <a-modal
            title="项目信息"
            v-model="projectInfoVisible"
            width="90vw"
            :footer="null"
    >
      <ProjectInfo :formData="projectInfoData" :projectUsers="projectUsers"/>
    </a-modal>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import ProjectInfo from "../ProjectInfo/ProjectInfo";
  const statusMap = {
    0: {
      status: 'success',
      text: '已签'
    },
    1: {
      status: 'processing',
      text: '洽谈'
    },
    2: {
      status: 'error',
      text: '投标'
    },
  };

  export default {
    name: "ProjectListPage",
    components: {
      ProjectInfo,
    },
    data() {
      return {
        formLayout: 'inline',
        contractId: '',
        spinning: false,
        tableData: [],
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20'], // 每页数量选项
          total: 0,
          current: 1,
        },
        columns: [
          {
            title: '序号',
            width: 70,
            fixed: 'left',
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          },
          {
            title: '合同号',
            width: 120,
            fixed: 'left',
            key: 'contractId',
            dataIndex: 'contractId',
          },
          {
            title: '合同名称',
            width: 150,
            key: 'contractName',
            dataIndex: 'contractName',
          },
          {
            title: '设计号',
            width: 150,
            key: 'designId',
            dataIndex: 'designId',
          },
          {
            title: '签约状态',
            width: 150,
            key: 'isSign',
            dataIndex: 'isSign',
            scopedSlots: {customRender: 'isSign'}
          },
          {
            title: '项目规模(平方米)',
            width: 150,
            key: 'scale',
            dataIndex: 'scale',
          },
          {
            title: '收款比例',
            width: 100,
            key: 'ratio',
            dataIndex: 'ratio',
            scopedSlots: {customRender: 'ratio'}
          },
          {
            title: '累计开票金额(元)',
            width: 150,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
          },
          {
            title: '已开发票未收款金额(元)',
            width: 210,
            key: 'receiptNotCash',
            dataIndex: 'receiptNotCash',
          },
          {
            title: '剩余发票额(元)',
            width: 150,
            key: 'receiptRemain',
            dataIndex: 'receiptRemain',
          },
          {
            title: '项目总金额(元)',
            width: 150,
            key: 'projectAmount',
            dataIndex: 'projectAmount',
          },
          {
            title: '累计现金回款(元)',
            width: 150,
            key: 'cashAmount',
            dataIndex: 'cashAmount',
          },
          {
            title: '剩余合同额(元)',
            width: 150,
            key: 'contractRemain',
            dataIndex: 'contractRemain',
          },
          {
            title: '项目总投资额(元)',
            width: 150,
            key: 'projectInvestment',
            dataIndex: 'projectInvestment',
          },
          {
            title: '项目工资',
            width: 100,
            key: 'projectSalary',
            dataIndex: 'projectSalary',
            scopedSlots: {customRender: 'projectSalary'}
          },
          {
            title: '项目经理',
            width: 120,
            key: 'projectManager',
            dataIndex: 'projectManager',
          },
          {
            title: '行政专员',
            width: 120,
            key: 'projectSecretary',
            dataIndex: 'projectSecretary',
          },
          {
            title: '总监',
            width: 120,
            key: 'inspector',
            dataIndex: 'inspector',
          },
          {
            title: '经营负责人',
            width: 120,
            key: 'runningManager',
            dataIndex: 'runningManager',
          },
          {
            width: 180,
            title: '项目操作',
            fixed: 'right',
            key: 'selectIndex',
            dataIndex: 'selectIndex',
            scopedSlots: {customRender: 'selectIndex'}
          },
        ],
        salaryVisible: false, // 工资弹窗控制
        salaryTableSpinning: false,
        salaryColumns: [
          {
            title: '序号',
            width: 70,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          },
          {
            title: '员工名称',
            width: 100,
            dataIndex: 'staffName',
            key: 'staffName',
          },
          {
            title: '员工号',
            width: 100,
            dataIndex: 'staffCode',
            key: 'staffCode',
            scopedSlots: {customRender: 'staffCode'}
          },
          {
            title: '工资',
            width: 100,
            dataIndex: 'money',
            key: 'money',
          },
          {
            title: '备注',
            width: 100,
            dataIndex: 'staffNote',
            key: 'staffNote',
          },
        ],
        salaryTableData: [], // 工资列表数据
        salaryPaginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '10', '15'], // 每页数量选项
          total: 0,
          current: 1,
        },
        contractIdForSalary: '',
        projectInfoVisible: false,
        projectInfoData: {},
        projectUsers: [],
        subCategoryList: [], // 分项list
        tempSubProjects: [],
      }
    },
    filters: {
      statusFilter(type) {
        return statusMap[type].text
      },
      statusTypeFilter(type) {
        return statusMap[type].status
      }
    },
    mounted() {
      this.updateTableData();
      this.getCategoryListByNameLike({
        categoryType: 4,
        categoryName: '',
      }).then(res => {
        this.subCategoryList = res && res.data.data;
        this.subCategoryList.map(item => {
          this.tempSubProjects.push({
            organization: null,
            subCategory: {
              categoryId: item.categoryId,
              categoryType: item.categoryType,
              categoryName: item.categoryName,
            },
            outContracts: [],
            designTeam: null,
            designFees: 0,
            price: 0,
            note: null,
          })
        });
      })
    },
    activated() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        getProjectListByIdLike: 'contractList/getProjectListByIdLike',
        cashExport: 'cashOperation/cashExport',
        getSalaryListByContractId: 'salaryOperation/getSalaryListByContractId',
        getProjectByContractId: 'contractList/getProjectByContractId',
        getCategoryListByNameLike: 'categoryOperation/getCategoryListByNameLike',
        getHistoryByContractId: 'projectCirculationOperation/getHistoryByContractId',
      }),
      updateTableData() {
        this.spinning = true;
        const params = {
          contractId: this.contractId,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
        };
        this.getProjectListByIdLike(params).then((data) => {
          if (data.data.meta.success) {
            this.paginationProps.total = data.data.data.totalElements;
            this.tableData = data.data.data.content.map((item, index) => {
              return {
                key: index,
                id: item.id,
                projectManager: item.projectManager,
                projectSecretary: item.projectSecretary,
                inspector: item.inspector,
                runningManager: item.runningManager,
                receiptAmount: item.receiptAmount,
                receiptNotCash: item.receiptNotCash,
                receiptRemain: item.receiptRemain,
                projectAmount: item.projectAmount,
                contractId: item.contractId,
                cashAmount: item.cashAmount,
                designId: item.designId,
                contractName: item.contractName,
                contractRemain: item.contractRemain,
                projectInvestment: item.projectInvestment,
                isSign: item.isSign,
                scaleArea: item.scale,
                aboveGroundArea: item.aboveGroundArea,
                underGroundArea: item.underGroundArea,
                scale: (item.aboveGroundArea || item.underGroundArea) && ('地上' + item.aboveGroundArea + '+地下' + item.underGroundArea), // 项目规模(平方米)
                ratio: item.ratio && Number((item.ratio * 100).toFixed(4)),
              }
            });
            this.spinning = false;
          } else {
            this.$message.error(data.data.meta.message);
            this.spinning = false;
          }
        }).catch((error) => {
          this.spinning = false;
        });
      },
      handleQuery() {
        this.updateTableData();
      },
      handleOpen(selectData) {
        this.projectInfoVisible = true;
        this.getHistoryByContractId({
          id: selectData.id,
        }).then(res => {
          this.projectUsers = res && res.data.data;
        });
        this.getProjectByContractId({
          contractId: selectData.contractId
        }).then(res => {
          this.projectInfoData = res && res.data.data.contract;
          Object.assign(this.projectInfoData, {
            aboveGroundArea: selectData.aboveGroundArea,
            underGroundArea: selectData.underGroundArea
          });
          this.projectInfoData.subProjects.map(item => {
            this.tempSubProjects[this.tempSubProjects.findIndex(tempItem => item.subCategory.categoryId === tempItem.subCategory.categoryId)] = item;
          });
          this.projectInfoData.subProjects = this.tempSubProjects;
        });
      },
      handleCashExport(data) {
        let fileName = '现金发票.xlsx';
        this.cashExport({
          contractIds: [data.contractId],
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
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      // 更新工资列表数据
      updateSalaryTableData() {
        this.salaryTableSpinning = true;
        const params = {
          contractId: this.contractIdForSalary,
          pageNum: this.salaryPaginationProps.current,
          pageLimit: this.salaryPaginationProps.pageSize
        };
        this.getSalaryListByContractId(params).then((data) => {
          if (data.data.meta.success) {
            this.salaryTableData = data.data.data.salaries.content.map((item, index) => {
              return {
                key: index,
                staffName: item.staff.staffName,
                staffNote: item.staff.staffNote,
                money: item.money,
                staffCode: item.staff.staffCode,
              }
            });
          } else {
            this.$message.error(data.data.meta.message);
          }
          this.salaryTableSpinning = false;
        }).catch((error) => {
          this.salaryTableSpinning = false;
          this.$message.error(error);
        });
      },
      handleOpenSalary(selectData) {
        this.salaryVisible = true;
        this.contractIdForSalary = selectData.contractId;
        this.updateSalaryTableData();
      },
      handleSalaryTableChange(pagination) {
        this.salaryPaginationProps.current = pagination.current;
        this.salaryPaginationProps.pageSize = pagination.pageSize;
        this.updateSalaryTableData();
      },
    }
  }
</script>