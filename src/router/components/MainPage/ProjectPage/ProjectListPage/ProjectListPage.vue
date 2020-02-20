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
      <a-form-item>
        <a-dropdown :trigger="['click']">
          <a-button icon="down" type="primary">
            导出
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item key="0">
              <a-button type="primary" @click="handleExport">
                项目导出
              </a-button>
            </a-menu-item>
            <a-menu-item key="1">
              <a-button type="primary" @click="handleCashExport">
                现金发票
              </a-button>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-form-item>
      <a-form-item>
        <a-popover title="项目选择列表" placement="bottom" trigger="click" v-model="popVisible">
          <template slot="content">
            <div v-if="!!selectProjectInfo.length" style="width: 350px">
              <template v-for="(item, index) in selectProjectInfo">
                <div :key="index">
                  <span>{{index + 1}}</span>
                  <a-divider type="vertical"/>
                  <span>{{item.contractId}}</span>
                  <a-divider type="vertical"/>
                  <span>{{item.contractName}}</span>
                </div>
              </template>
            </div>
            <a-empty v-else/>
          </template>
          <a-button type="dashed" @click="() => this.popVisible = true">
            选择列表
          </a-button>
        </a-popover>
      </a-form-item>
      <a-form-item>
        <a-popover title="表单配置" placement="bottom" trigger="click" v-model="settingVisible">
          <template slot="content">
            <div style="width: 480px">
              <a-checkbox-group v-model="selectOptions" @change="onTableHeaderChange">
                <a-row>
                  <a-col :span="8" v-for="(item, index) in options" :key="index">
                    <a-checkbox :value="item">{{item}}</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </div>
          </template>
          <a-button type="primary" icon="setting">表头配置</a-button>
        </a-popover>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-spin :spinning="spinning" tip="Loading...">
        <a-table bordered :columns="columns" :dataSource="tableData"
                 :pagination="paginationProps"
                 @change="handleTableChange" :scroll="{ x: 2280, y: 550}">
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
            <a-button v-if="text" type="danger" size="small" @click="handleRemoved(record)">
              移除
            </a-button>
            <a-button v-else type="primary" size="small" @click="handleSelected(record)">
              选择
            </a-button>
          </template>
          <a-progress slot="ratio" slot-scope="text" type="circle" :percent="text*100" :width="60" />
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
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'

  const statusMap = {
    true: {
      status: 'success',
      text: '已签约'
    },
    false: {
      status: 'error',
      text: '未签约'
    }
  };
  export default {
    name: "ProjectListPage",
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
            width: 180,
            title: '项目操作',
            fixed: 'right',
            key: 'selectIndex',
            dataIndex: 'selectIndex',
            scopedSlots: {customRender: 'selectIndex'}
          },
        ],
        settingVisible: false, // 配置表头菜单弹出控制
        selectOptions: ['合同号','合同名称','设计号','签约状态','项目规模(平方米)','已收款比例','投资额(万元)'],
        options: ['签约状态','设计号','合同号','发包人合同编号','合同名称','合同节点','合同额(元)','累计现金回款(元)',
        '剩余合同额(元)','已收款比例','累计开票金额(元)','已开发票未收款金额','实际签约日期','合同归档日期',
        '项目类别','主设计部门','经营部门','项目经理','项目预算秘书','经营经理','发包方','投资额(万元)','项目规模(平方米)',
        '地域','地区关键词','建筑一级分类','建筑二级分类','是否EPC项目'],
        popVisible: false, // 需要导出的列表弹窗控制
        selectProjectInfo: [], // 被选择的项目信息
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
    },
    activated() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        getProjectListByIdLike: 'contractList/getProjectListByIdLike',
        exportContract: 'contractList/exportContract',
        cashExport: 'cashOperation/cashExport',
        getSalaryListByContractId: 'salaryOperation/getSalaryListByContractId',
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
                scale: item.scale,
                ratio: item.ratio && item.ratio.toFixed(4),
                selectIndex: !!this.selectProjectInfo.find(value => value.contractId === item.contractId),
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
        this.$emit('handleContractOpen', selectData.contractId)
      },
      handleExport() {
        let fileName = '项目.xlsx';
        this.exportContract({
          contractIds: this.selectProjectInfo.map((item) => {return item.contractId}),
          header: this.selectOptions,
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
      handleCashExport() {
        let fileName = '现金发票.xlsx';
        this.cashExport({
          contractIds: this.selectProjectInfo.map((item) => {return item.contractId}),
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
      // 处理表头选择
      onTableHeaderChange(checkedValues) {
        this.selectOptions = checkedValues
      },
      // 处理项目选择
      handleSelected(rowData) {
        rowData.selectIndex = true;
        this.selectProjectInfo.push({
          contractId: rowData.contractId,
          contractName: rowData.contractName
        });
        this.popVisible = true;
      },
      removeProjectInfo(id) {
        this.selectProjectInfo.splice(this.selectProjectInfo.findIndex(item => item.contractId === id), 1);
      },
      // 处理项目移除
      handleRemoved(rowData) {
        rowData.selectIndex = false;
        this.removeProjectInfo(rowData.contractId);
        this.popVisible = true;
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
      }
    }
  }
</script>