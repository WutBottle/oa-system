<style lang="scss" scoped>
  .CashPage {
    .page-header {
      background: #fff;
      padding: 16px 32px 0;
      border-bottom: 1px solid #e8e8e8;

      .bread {
        margin-bottom: 16px;
      }

      .title {
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        color: rgba(0, 0, 0, .85);
        margin-bottom: 16px;
      }
    }

    .page-content {
      padding: 30px;

      .steps-content {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;
        text-align: center;
        padding-top: 40px;

        .header-wrapper {
          margin-bottom: 18px;
        }

        .table-wrapper {
          padding: 30px;
        }
      }

      .steps-action {
        margin-top: 24px;
      }
    }
  }
</style>

<template>
  <div class="CashPage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>合同现金管理</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">合同现金管理
        <CashReceiptInput type="cash"/>
      </p>
    </div>
    <div class="page-content">
      <a-row style="background-color: #fff; padding: 24px;">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
        </a-steps>
        <div class="steps-content">
          <template v-if="steps[current].type === 'searchContract'">
            <a-select
                    showSearch
                    :value="contractValue"
                    placeholder="搜索合同号、合同名称"
                    :showArrow="false"
                    style="width: 300px"
                    :filterOption="false"
                    @search="fetchOutContract"
                    @change="handleChange"
                    notFoundContent="无搜索结果"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in contractsData" :key="d.contractId">
                {{d.contractId}}
                <a-divider type="vertical" />
                {{d.contractName}}
              </a-select-option>
            </a-select>
          </template>
          <template v-else>
            <a-spin :spinning="tableSpinning">
              <div class="header-wrapper">
                <h3>合同号：{{this.contractId}}——合同名称：{{this.contractName}}——设计号：{{this.designId}}</h3>
              </div>
              <div class="table-wrapper">
                <a-table bordered :columns="columns" :dataSource="tableData"
                         :pagination="paginationProps"
                         @change="handleTableChange" :scroll="{ x:'max-content', y: 450}">
                  <span slot="serial" slot-scope="text, record, index">
                    {{ index + 1 }}
                  </span>
                  <div slot="cashAmount" slot-scope="text" style="text-align: right;">
                    {{numToMoney(text)}}
                  </div>
                  <span slot="receipts" slot-scope="tags">
                    <a-tag v-for="tag in tags" color="blue"
                           :key="tag.id">{{tag.receiptId}}</a-tag>
                  </span>
                  <span slot="operation" slot-scope="text, record">
                    <a @click="handleCashEdit(record)">修改</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除？" @confirm="handleCashDelete(record)" okText="确定" cancelText="取消">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                </a-table>
                <a-statistic title="当前列表现金总额" :precision="2" :value="currentCashTotal">
                  <template v-slot:suffix>
                    <span>元</span>
                  </template>
                </a-statistic>
              </div>
            </a-spin>
          </template>
        </div>
        <div class="steps-action">
          <a-button
                  :disabled="this.contractValue === undefined"
                  v-if="current < steps.length - 1"
                  type="primary" @click="next"
          >
            下一步
          </a-button>
          <a-button
                  v-if="current == steps.length - 1"
                  type="primary"
                  icon="plus"
                  @click="() => this.addVisible = true"
          >
            新增
          </a-button>
          <a-button
                  v-if="current>0"
                  style="margin-left: 8px"
                  @click="prev"
          >
            上一步
          </a-button>
        </div>
      </a-row>
    </div>
    <a-modal
            title="新增发票信息"
            v-model="addVisible"
            @ok="submitForm"
            okText="提交"
            cancelText="取消"
            :afterClose="handleAddClose"
            :maskClosable="false"
    >
      <a-form
              :form="addForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="现金回款日期"
        >
          <a-date-picker
                  v-decorator="['cashDate',  {
        rules: [{ type: 'object', required: true, message: '请输入现金回款日期!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="现金回款金额(元)"
        >
          <a-input
                  v-decorator="[
          'cashAmount',
          {rules: [{
            required: true, message: '请输入现金回款金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入现金回款金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="选择发票号"
        >
          <a-select
                  v-decorator="[
          'receipts',
          {rules: [{required: true, message: '请选择发票号!'}]}
        ]"
                  mode="multiple"
                  placeholder="请选择发票号"
          >
            <a-select-option v-for="item in receiptsList" :key="item.id">
              {{item.receiptId}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
            title="修改现金回款信息"
            placement="right"
            :closable="false"
            width="550"
            @close="onEditClose"
            :visible="editVisible"
    >
      <a-form
              :form="editForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="现金回款id"
        >
          <a-input
                  disabled
                  v-decorator="[
          'cashId',
          {initialValue: this.editFormData.cashId, rules: [{required: true, message: '请输入现金回款id!'}]}
        ]"
                  placeholder="请输入现金回款id"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="现金回款日期"
        >
          <a-date-picker
                  v-decorator="[
          'cashDate',
          {initialValue:this.editFormData.cashDate, rules: [{ type: 'object', required: true, message: '请输入现金回款日期!' }]}
          ]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="现金回款金额(元)"
        >
          <a-input
                  v-decorator="[
          'cashAmount',
          {initialValue: this.editFormData.cashAmount, rules: [{
            required: true, message: '请输入现金回款金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入现金回款金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="选择发票号"
        >
          <a-select
                  v-decorator="[
          'receipts',
          {initialValue: this.editFormData.receipts, rules: [{required: true, message: '请选择发票号!'}]}
        ]"
                  mode="multiple"
                  placeholder="请选择发票号"
          >
            <a-select-option v-for="item in receiptsList" :key="item.id">
              {{item.receiptId}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formTailLayout.labelCol"
                :wrapper-col="formTailLayout.wrapperCol"
        >
          <a-button
                  type="primary"
                  @click="submitEditForm"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import {debounce} from 'debounce';
  import moment from 'moment';
  import CashReceiptInput from "../CashReceiptInput/CashReceiptInput";
  import numToMoney from '@utils/numToMoney';
  import {INFINITY} from "@/store/mutation-types";

  const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  export default {
    name: "CashPage",
    components: {
      CashReceiptInput,
    },
    data() {
      this.fetchOutContract = debounce(this.fetchOutContract, 500);
      return {
        formItemLayout,
        formTailLayout,
        numToMoney,
        current: 0,
        steps: [{
          title: '选择合同',
          type: 'searchContract',
        }, {
          title: '添加现金回款信息',
          type: 'addInfo',
        }],
        contractValue: undefined,
        contractValueId: '',
        contractsData: [], // 获取的合同id列表
        fetching: false, // 查询合同号加载控制
        receiptsList: [], // 发票列表
        addVisible: false,// 新增弹窗控制
        tableSpinning: false, // table数据更新加载控制
        columns: [
          {
            title: '序号',
            width: 70,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          }, {
            title: '现金回款日期',
            width: 200,
            key: 'cashDate',
            dataIndex: 'cashDate',
            sorter: (a, b) => new Date(a.cashDate) - new Date(b.cashDate),
          }, {
            title: '现金回款金额',
            width: 150,
            key: 'cashAmount',
            dataIndex: 'cashAmount',
            sorter: (a, b) => a.cashAmount - b.cashAmount,
            scopedSlots: {customRender: 'cashAmount'}
          }, {
            title: '对应发票',
            width: 150,
            key: 'receipts',
            dataIndex: 'receipts',
            scopedSlots: {customRender: 'receipts'},
          }, {
            title: '编辑现金回款',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }
        ],
        addForm: this.$form.createForm(this),
        editForm: this.$form.createForm(this),
        editFormData: {}, // 编辑当前表单数据
        editVisible: false, // 编辑现金回款窗口控制
        selectedReceipts: [],
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.cashOperation.cashListPaginationProps,// 分页控制
        tableData: state => state.cashOperation.cashListTableData, // 列表数据
        currentCashTotal: state => state.cashOperation.currentCashTotal, // 现金总额
        contractId: state => state.cashOperation.contractId, // 合同号
        designId: state => state.cashOperation.designId, // 设计号
        contractName: state => state.cashOperation.contractName, // 合同名称
      }),
    },
    activated() {
      const {contractId = undefined} = this.$router.currentRoute.query;
      this.contractValue = contractId;
      if (contractId) {
        this.current++;
        this.updateTableData();
      }
    },
    methods: {
      ...mapActions({
        getContractIdsByIdLike: 'contractList/getContractIdsByIdLike',
        getReceiptsByContractId: 'receiptOperation/getReceiptsByContractId',
        getCashesByContractId: 'cashOperation/getCashesByContractId',
        addCash: 'cashOperation/addCash',
        deleteCash: 'cashOperation/deleteCash',
        verifyCash: 'cashOperation/verifyCash'
      }),
      next() {
        this.current++;
        this.updateTableData();
      },
      prev() {
        this.current--
      },
      // 获取发票列表
      getReceiptList() {
        this.getReceiptsByContractId({
          contractId: this.contractValue
        }).then((res) => {
          this.receiptsList = res.data.data.receipts;
        })
      },
      // 更新列表数据
      updateTableData() {
        this.tableSpinning = true;
        const params = {
          contractId: this.contractValue,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize === Infinity ? INFINITY : this.paginationProps.pageSize,
        };
        this.getCashesByContractId(params).then((data) => {
          if (!data.data.data) {
            this.current = 0;
            this.contractValue = undefined;
            this.$message.error(data.data.meta.message);
          }
          this.tableSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
          this.tableSpinning = false;
        });
      },
      // 合同模糊查询
      fetchOutContract(value) {
        const params = {
          contractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getContractIdsByIdLike(params).then((res) => {
          this.contractsData = res && res.data.data.content;
          this.fetching = false;
        });
      },
      // 选择合同号处理
      handleChange(value) {
        Object.assign(this, {
          contractValue: value,
          contractValueId: this.contractsData[this.contractsData.findIndex(item => item.contractId === value)].id,
          fetching: false,
        });
        this.getReceiptList();
      },
      // 处理分页信息
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      // 处理编辑
      handleCashEdit(selectCashData) {
        this.editForm.resetFields();
        this.editFormData = JSON.parse(JSON.stringify(selectCashData));
        this.editFormData.cashDate = moment(this.editFormData.cashDate);
        this.editFormData.receipts = this.editFormData.receipts.map(item => {
          return item.id;
        });
        this.editVisible = true;
      },
      // 处理删除
      handleCashDelete(selectCashData) {
        const params = {
          cashIds: [selectCashData.cashId]
        };
        this.deleteCash(params).then((res) => {
          this.updateTableData();
          this.$message.success(res.data.data)
        })
      },
      // 添加现金发票信息
      submitForm() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                id: this.contractValueId,
                cashes: [{
                  cashDate: values.cashDate,
                  cashAmount: values.cashAmount,
                  receipts: values.receipts.map(item => {
                    return {
                      id: item,
                    }
                  })
                }],
              };
              this.addCash(params).then((res) => {
                if (res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.addForm.resetFields();
                  this.updateTableData();
                  this.addVisible = false;
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      // 关闭添加弹窗处理
      handleAddClose() {
        // 关闭添加弹窗后还原数据
        this.addForm.resetFields();
      },
      // 关闭修改弹窗
      onEditClose() {
        this.editVisible = false;
      },
      // 修改现金回款处理
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                cashId: values.cashId,
                cashDate: values.cashDate,
                cashAmount: values.cashAmount,
                receipts: values.receipts.map(item => {
                  return {
                    id: item,
                  }
                })
              };
              this.verifyCash(params).then((res) => {
                if (res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.editForm.resetFields();
                  this.editVisible = false;
                  this.updateTableData();
                } else {
                  this.$message.error(res.data.meta.message);
                }
              })
            }
          },
        );
      },
    }
  }
</script>