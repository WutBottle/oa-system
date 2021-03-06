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
              label="查询关键词"
      >
        <a-input style="width: 200px" v-model="contractId" placeholder="合同号、合同名称"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleQuery(true)">
          查询
        </a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" icon="search" @click="() => this.queryVisible=true">精确查询</a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-spin :spinning="spinning" tip="Loading...">
        <a-table bordered :columns="columns" :dataSource="tableData"
                 :pagination="paginationProps"
                 @change="handleTableChange" :scroll="{ x: 2820, y: 550}">
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <div slot="receiptAmount" slot-scope="text" style="text-align: right;">
            {{numToMoney(text)}}
          </div>
          <div slot="receiptNotCash" slot-scope="text" style="text-align: right;">
            {{numToMoney(text)}}
          </div>
          <div slot="projectAmount" slot-scope="text" style="text-align: right;">
            {{numToMoney(text)}}
          </div>
          <div slot="cashAmount" slot-scope="text" style="text-align: right;">
            {{numToMoney(text)}}
          </div>
          <div slot="contractRemain" slot-scope="text" style="text-align: right;">
            {{numToMoney(text)}}
          </div>
          <div slot="projectInvestment" slot-scope="text" style="text-align: right;">
            {{numToMoney(text / 10000)}}
          </div>
          <span slot="isSign" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
          </span>
          <template slot="selectIndex" slot-scope="text, record">
            <a-button type="primary" size="small" @click="handleOpen(record)">
              查看
            </a-button>
            <a-divider type="vertical"/>
            <a @click="jumpToManager(record)">管理</a>
          </template>
          <a-progress slot="ratio" slot-scope="text" type="circle" :percent="text" :width="60"/>
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
          <div slot="money" slot-scope="text" style="text-align: right;">
            {{numToMoney(text)}}
          </div>
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
    <a-drawer
            title="筛选条件"
            placement="right"
            :closable="false"
            @close="() => this.queryVisible = false"
            :visible="queryVisible"
            width="500"
    >
      <a-form formLayout="horizontal">
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="签约状态"
        >
          <a-select
                  :allowClear="true"
                  v-model="isSign"
                  placeholder="请选择签约状态"
          >
            <a-select-option :value="0">
              已签
            </a-select-option>
            <a-select-option :value="1">
              洽谈
            </a-select-option>
            <a-select-option :value="2">
              投标
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="规模范围"
        >
          <a-input-number :min="0" :max="Infinity" v-model="scaleLowerBound"
                          @blur="onChange('scaleLowerBound','scaleUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="scaleUpperBound"
                          @blur="onChange('scaleLowerBound','scaleUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="收款比例">
          <a-input-number :min="0" :max="100" v-model="ratioLowerBound"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"
                          @blur="onChange('ratioLowerBound','ratioUpperBound')"/>
          ~
          <a-input-number :min="0" :max="100" v-model="ratioUpperBound"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"
                          @blur="onChange('ratioLowerBound','ratioUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="累开发票金额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="receiptAmountLowerBound"
                          @blur="onChange('receiptAmountLowerBound','receiptAmountUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="receiptAmountUpperBound"
                          @blur="onChange('receiptAmountLowerBound','receiptAmountUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目总额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="totalLowerBound"
                          @blur="onChange('totalLowerBound','totalUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="totalUpperBound"
                          @blur="onChange('totalLowerBound','totalUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="累计现金回款"
        >
          <a-input-number :min="0" :max="Infinity" v-model="cashAmountLowerBound"
                          @blur="onChange('cashAmountLowerBound','cashAmountUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="cashAmountUpperBound"
                          @blur="onChange('cashAmountLowerBound','cashAmountUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="剩余合同额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="contractRemainLowerBound"
                          @blur="onChange('contractRemainLowerBound','contractRemainUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="contractRemainUpperBound"
                          @blur="onChange('contractRemainLowerBound','contractRemainUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目投资总额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="projectInvestmentLowerBound"
                          @blur="onChange('projectInvestmentLowerBound','projectInvestmentUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="projectInvestmentUpperBound"
                          @blur="onChange('projectInvestmentLowerBound','projectInvestmentUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="时间范围"
        >
          <a-range-picker style="width: 220px;" v-model="queryDate"/>
        </a-form-item>
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <a-button type="primary" @click="handleQuery(false)">
            查找
          </a-button>
          <a-button style="margin-left: 16px" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import ProjectInfo from "../ProjectInfo/ProjectInfo";
  import moment from "moment";
  import numToMoney from "@utils/numToMoney";
  import {INFINITY} from '@/store/mutation-types';

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
    3: {
      status: 'error',
      text: '待定'
    },
  };
  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  export default {
    name: "ProjectListPage",
    components: {
      ProjectInfo,
    },
    computed: {
      ...mapState({
        subCategoryList: state => state.categoryOperation.subCategoryList,
      })
    },
    data() {
      return {
        formLayout: 'inline',
        numToMoney,
        formItemLayout,
        formTailLayout,
        contractId: '',
        spinning: false,
        tableData: [],
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40', 'Infinity'], // 每页数量选项
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
            sorter: (a, b) => (b.contractId || '').localeCompare(a.contractId || ''),
          },
          {
            title: '合同名称',
            width: 150,
            key: 'contractName',
            dataIndex: 'contractName',
            sorter: (a, b) => (b.contractName || '').localeCompare(a.contractName || ''),
          },
          {
            title: '设计号',
            width: 150,
            key: 'designId',
            dataIndex: 'designId',
            sorter: (a, b) => (b.designId || '').localeCompare(a.designId || ''),
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
            width: 120,
            key: 'ratio',
            dataIndex: 'ratio',
            scopedSlots: {customRender: 'ratio'},
            sorter: (a, b) => a.ratio - b.ratio,
          },
          {
            title: '累计开票金额(元)',
            width: 170,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
            sorter: (a, b) => a.receiptAmount - b.receiptAmount,
            scopedSlots: {customRender: 'receiptAmount'}
          },
          {
            title: '已开发票未收款金额(元)',
            width: 210,
            key: 'receiptNotCash',
            dataIndex: 'receiptNotCash',
            sorter: (a, b) => a.receiptNotCash - b.receiptNotCash,
            scopedSlots: {customRender: 'receiptNotCash'}
          },
          {
            title: '项目总金额(元)',
            width: 150,
            key: 'projectAmount',
            dataIndex: 'projectAmount',
            sorter: (a, b) => a.projectAmount - b.projectAmount,
            scopedSlots: {customRender: 'projectAmount'}
          },
          {
            title: '累计现金回款(元)',
            width: 170,
            key: 'cashAmount',
            dataIndex: 'cashAmount',
            sorter: (a, b) => a.cashAmount - b.cashAmount,
            scopedSlots: {customRender: 'cashAmount'}
          },
          {
            title: '剩余合同额(元)',
            width: 150,
            key: 'contractRemain',
            dataIndex: 'contractRemain',
            sorter: (a, b) => a.contractRemain - b.contractRemain,
            scopedSlots: {customRender: 'contractRemain'}
          },
          {
            title: '项目总投资额(万元)',
            width: 180,
            key: 'projectInvestment',
            dataIndex: 'projectInvestment',
            sorter: (a, b) => a.projectInvestment - b.projectInvestment,
            scopedSlots: {customRender: 'projectInvestment'}
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
            title: '商务专员',
            width: 120,
            key: 'projectSecretary',
            dataIndex: 'projectSecretary',
          },
          {
            title: '财务专员',
            width: 120,
            key: 'financeManager',
            dataIndex: 'financeManager',
          },
          {
            title: '项目经营负责人',
            width: 140,
            key: 'runningManager',
            dataIndex: 'runningManager',
          },
          {
            title: '部门经营负责人',
            width: 140,
            key: 'inspector',
            dataIndex: 'inspector',
          },
          {
            width: 140,
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
            sorter: (a, b) => (b.staffName || '').localeCompare(a.staffName || ''),
          },
          {
            title: '员工号',
            width: 100,
            dataIndex: 'staffCode',
            key: 'staffCode',
            sorter: (a, b) => (b.staffCode || '').localeCompare(a.staffCode || ''),
            scopedSlots: {customRender: 'staffCode'},
          },
          {
            title: '工资',
            width: 100,
            dataIndex: 'money',
            key: 'money',
            sorter: (a, b) => a.money - b.money,
            scopedSlots: {customRender: 'money'}
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
          pageSizeOptions: ['5', '15', '20', '40', 'Infinity'], // 每页数量选项
          total: 0,
          current: 1,
        },
        contractIdForSalary: '',
        projectInfoVisible: false,
        projectInfoData: {},
        projectUsers: [],
        tempSubProjects: [],
        queryVisible: false,
        queryDate: [],
        isSign: undefined,
        scaleUpperBound: null,
        scaleLowerBound: null,
        totalLowerBound: null,
        totalUpperBound: null,
        ratioLowerBound: null,
        ratioUpperBound: null,
        receiptAmountLowerBound: null,
        receiptAmountUpperBound: null,
        cashAmountLowerBound: null,
        cashAmountUpperBound: null,
        contractRemainLowerBound: null,
        contractRemainUpperBound: null,
        projectInvestmentLowerBound: null,
        projectInvestmentUpperBound: null,
      }
    },
    filters: {
      statusFilter(type) {
        if (type >= 0) {
          return statusMap[type].text
        } else {
          return statusMap[3].text
        }
      },
      statusTypeFilter(type) {
        if (type >= 0) {
          return statusMap[type].status
        } else {
          return statusMap[3].status
        }
      }
    },
    watch:{
      subCategoryList: {
        immediate: true,
        handler() {
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
        }
      }
    },
    mounted() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        getProjectListAfterFilter: 'contractList/getProjectListAfterFilter',
        getSalaryListByContractId: 'salaryOperation/getSalaryListByContractId',
        getProjectByContractId: 'contractList/getProjectByContractId',
        getHistoryByContractId: 'projectCirculationOperation/getHistoryByContractId',
      }),
      updateTableData() {
        this.spinning = true;
        let actualDate;
        if (this.queryDate.length) {
          actualDate = [moment(this.queryDate[0]).format('YYYY-MM-DD'), moment(this.queryDate[1]).format('YYYY-MM-DD')]
        } else {
          actualDate = ['', '']
        }
        const params = {
          contractId: this.contractId,
          actualDate: actualDate,
          isSign: this.isSign,
          cashAmount: [this.cashAmountLowerBound ? String(this.cashAmountLowerBound) : '', this.cashAmountUpperBound ? String(this.cashAmountUpperBound) : ''],
          contractRemain: [this.contractRemainLowerBound ? String(this.contractRemainLowerBound) : '', this.contractRemainUpperBound ? String(this.contractRemainUpperBound) : ''],
          projectInvestment: [this.projectInvestmentLowerBound ? String(this.projectInvestmentLowerBound) : '', this.projectInvestmentUpperBound ? String(this.projectInvestmentUpperBound) : ''],
          receiptAmount: [this.receiptAmountLowerBound ? String(this.receiptAmountLowerBound) : '', this.receiptAmountUpperBound ? String(this.receiptAmountUpperBound) : ''],
          projectAmount: [this.totalLowerBound ? String(this.totalLowerBound) : '', this.totalUpperBound ? String(this.totalUpperBound) : ''],
          ratio: [this.ratioLowerBound ? String(this.ratioLowerBound / 100) : '', this.ratioUpperBound ? String(this.ratioUpperBound / 100) : ''],
          scale: [this.scaleLowerBound ? String(this.scaleLowerBound) : '', this.scaleUpperBound ? String(this.scaleUpperBound) : ''],
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize === Infinity ? INFINITY : this.paginationProps.pageSize,
        };
        this.getProjectListAfterFilter(params).then((data) => {
          if (data.data.meta.success) {
            this.paginationProps.total = data.data.data.totalElements;
            this.tableData = data.data.data.content.map((item, index) => {
              return {
                key: index,
                id: item.id,
                projectManager: item.projectManager,
                projectSecretary: item.projectSecretary,
                inspector: item.inspector,
                financeManager: item.financeManager,
                runningManager: item.runningManager,
                receiptAmount: item.receiptAmount,
                receiptNotCash: item.receiptNotCash,
                projectAmount: item.projectAmount,
                contractId: item.contractId,
                cashAmount: item.cashAmount,
                subProjectAmount: item.subProjectAmount,
                designId: item.designId,
                contractName: item.contractName,
                contractRemain: item.contractRemain,
                projectInvestment: item.projectInvestment,
                isSign: item.isSign,
                scaleArea: item.scale,
                aboveGroundArea: item.aboveGroundArea,
                underGroundArea: item.underGroundArea,
                scale: (item.aboveGroundArea || item.underGroundArea) && ('地上' + numToMoney(item.aboveGroundArea) + '+地下' + numToMoney(item.underGroundArea)), // 项目规模(平方米)
                ratio: !isNaN(item.ratio) && Number((item.ratio * 100).toFixed(2)),
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
      handleQuery(isReset) {
        if (isReset) {
          this.handleReset();
        }
        this.paginationProps.current = 1;
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
            subProjectAmount: selectData.subProjectAmount,
            aboveGroundArea: selectData.aboveGroundArea,
            underGroundArea: selectData.underGroundArea
          });
          let tempSubProjects = JSON.parse(JSON.stringify(this.tempSubProjects));
          this.projectInfoData.subProjects.map(item => {
            tempSubProjects[tempSubProjects.findIndex(tempItem => item.subCategory.categoryId === tempItem.subCategory.categoryId)] = item;
          });
          this.projectInfoData.subProjects = tempSubProjects;
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
          pageLimit: this.salaryPaginationProps.pageSize === Infinity ? INFINITY : this.salaryPaginationProps.pageSize,
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
      onChange(lowerBound, upperBound) {
        if (this[lowerBound] && this[upperBound] && this[upperBound] < this[lowerBound]) {
          let temp = this[lowerBound];
          this[lowerBound] = this[upperBound];
          this[upperBound] = temp;
        }
      },
      handleReset() {
        Object.assign(this, {
          queryDate: [],
          isSign: undefined,
          scaleUpperBound: null,
          scaleLowerBound: null,
          totalLowerBound: null,
          totalUpperBound: null,
          ratioLowerBound: null,
          ratioUpperBound: null,
          receiptAmountLowerBound: null,
          receiptAmountUpperBound: null,
          cashAmountLowerBound: null,
          cashAmountUpperBound: null,
          contractRemainLowerBound: null,
          contractRemainUpperBound: null,
          projectInvestmentLowerBound: null,
          projectInvestmentUpperBound: null,
        })
      },
      // 跳转到合同管理页面
      jumpToManager(data) {
        this.$router.push({
          path: '/main/contractmanager',
          query: {contractId: data.contractId}
        })
      }
    }
  }
</script>