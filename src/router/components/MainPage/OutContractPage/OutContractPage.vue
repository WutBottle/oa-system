<style lang="scss" scoped>
  .OutContractPage {
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
  <div class="OutContractPage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>分包录入</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">分包录入<OutContractInput/></p>
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
                    placeholder="搜索合同号"
                    :showArrow="false"
                    style="width: 300px"
                    :filterOption="false"
                    @search="fetchOutContract"
                    @change="handleChange"
                    notFoundContent="无搜索结果"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in contractsData" :key="d">{{d}}</a-select-option>
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
                  <span slot="operation" slot-scope="text, record">
                    <a @click="handleInvoiceEdit(record)">修改</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除？" @confirm="handleInvoiceDelete(record)" okText="确定" cancelText="取消">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                  <span slot="outContractCategory" slot-scope="id">{{outContractCategoryList[outContractCategoryList.findIndex((item) => item.outContractCategoryId === id)].outContractCategoryName}}</span>
                  <span slot="outProjectCategory" slot-scope="id">{{outProjectCategoryList[outProjectCategoryList.findIndex((item) => item.outProjectCategoryId === id)].outProjectCategoryName}}</span>
                </a-table>
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
            title="新增分包合同"
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
                label="分包合同号"
        >
          <a-input
                  v-decorator="[
          'outContractId',
          {rules: [{
            required: true, message: '请输入分包合同号!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入分包合同号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同名称"
        >
          <a-input
                  v-decorator="[
          'outContractName',
          {rules: [{required: true, message: '请输入分包合同名称!'}]}
        ]"
                  placeholder="请输入分包合同名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包单位名称"
        >
          <a-input
                  v-decorator="[
          'outCompanyName',
          {rules: [{required: true, message: '请输入分包单位名称!'}]}
        ]"
                  placeholder="请输入分包单位名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同金额(元)"
        >
          <a-input
                  v-decorator="[
          'outContractAmount',
          {rules: [{
            required: true, message: '请输入分包合同金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入分包合同金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="实际归档日期"
        >
          <a-date-picker
                  v-decorator="['outContractDate',  {
        rules: [{ type: 'object', required: true, message: '请输入实际归档日期!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包类型"
        >
          <a-select
                  v-decorator="[
          'outContractCategory',
          {rules: [{ required: true, message: '请选择分包类型！' }]}
        ]"
                  placeholder="请选择分包类型"
          >
            <template v-for="option in outContractCategoryList">
              <a-select-option :key="option.outContractCategoryId">
                {{option.outContractCategoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包项目类别"
        >
          <a-select
                  v-decorator="[
          'outProjectCategory',
          {rules: [{ required: true, message: '请选择分包项目类别！' }]}
        ]"
                  placeholder="请选择分包项目类别"
          >
            <template v-for="option in outProjectCategoryList">
              <a-select-option :key="option.outProjectCategoryId">
                {{option.outProjectCategoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
            title="修改分包信息"
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
                label="分包合同号"
        >
          <a-input
                  disabled
                  v-decorator="[
          'outContractId',
          {initialValue: this.editFormData.outContractId, rules: [{required: true, message: '请输入分包合同号!'}]}
        ]"
                  placeholder="请输入分包合同号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同名称"
        >
          <a-input
                  v-decorator="[
          'outContractName',
          {initialValue: this.editFormData.outContractName, rules: [{required: true, message: '请输入分包合同名称!'}]}
        ]"
                  placeholder="请输入分包合同名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包单位名称"
        >
          <a-input
                  v-decorator="[
          'outCompanyName',
          {initialValue: this.editFormData.outCompanyName, rules: [{required: true, message: '请输入分包单位名称!'}]}
        ]"
                  placeholder="请输入分包单位名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同金额(元)"
        >
          <a-input
                  v-decorator="[
          'outContractAmount',
          {initialValue: this.editFormData.outContractAmount, rules: [{
            required: true, message: '请输入分包合同金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入分包合同金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="实际归档日期"
        >
          <a-date-picker
                  v-decorator="[
          'outContractDate',
          {initialValue:this.editFormData.outContractDate, rules: [{ type: 'object', required: true, message: '请输入开票日期!' }]}
          ]"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包类型"
        >
          <a-select
                  v-decorator="[
          'outContractCategory',
          {initialValue: this.editFormData.outContractCategory, rules: [{ required: true, message: '请选择分包类型！' }]}
        ]"
                  placeholder="请选择分包类型"
          >
            <template v-for="option in outContractCategoryList">
              <a-select-option :key="option.outContractCategoryId">
                {{option.outContractCategoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包项目类别"
        >
          <a-select
                  v-decorator="[
          'outProjectCategory',
          {initialValue: this.editFormData.outProjectCategory, rules: [{ required: true, message: '请选择分包项目类别！' }]}
        ]"
                  placeholder="请选择分包项目类别"
          >
            <template v-for="option in outProjectCategoryList">
              <a-select-option :key="option.outProjectCategoryId">
                {{option.outProjectCategoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formTailLayout.labelCol"
                :wrapper-col="formTailLayout.wrapperCol"
        >
          <a-spin :spinning="editSpinning">
            <a-button
                    type="primary"
                    @click="submitEditForm"
            >
              提交
            </a-button>
          </a-spin>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import {debounce} from 'debounce';
  import moment from 'moment'
  import OutContractInput from "../OutContractInput/OutContractInput";

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };

  export default {
    name: "OutContractPage",
    components: {
      OutContractInput,
    },
    data() {
      this.fetchOutContract = debounce(this.fetchOutContract, 500);
      return {
        current: 0,
        steps: [{
          title: '选择合同号',
          type: 'searchContract',
        }, {
          title: '添加分包信息',
          type: 'addInfo',
        }],
        contractValue: undefined,
        contractsData: [],
        fetching: false,
        formLayout: 'inline',
        tableSpinning: false,
        columns: [
          {
            title: '序号',
            width: 70,
            fixed: 'left',
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          }, {
            title: '分包合同号',
            width: 150,
            fixed: 'left',
            key: 'outContractId',
            dataIndex: 'outContractId',
          }, {
            title: '分包合同名称',
            width: 150,
            key: 'outContractName',
            dataIndex: 'outContractName',
          }, {
            title: '分包单位名称',
            width: 150,
            key: 'outCompanyName',
            dataIndex: 'outCompanyName',
          }, {
            title: '分包合同金额(元)',
            width: 150,
            key: 'outContractAmount',
            dataIndex: 'outContractAmount',
          }, {
            title: '已付费金额(元)',
            width: 150,
            key: 'outPaid',
            dataIndex: 'outPaid',
          }, {
            title: '未付费金额(元)',
            width: 150,
            key: 'outUnpaid',
            dataIndex: 'outUnpaid',
          }, {
            title: '已付费比例',
            width: 150,
            key: 'ratio',
            dataIndex: 'ratio',
          }, {
            title: '实际归档日期',
            width: 200,
            key: 'outContractDate',
            dataIndex: 'outContractDate',
          }, {
            title: '分包类型',
            width: 150,
            key: 'outContractCategory',
            dataIndex: 'outContractCategory',
            scopedSlots: {customRender: 'outContractCategory'},
          }, {
            title: '分包项目类别',
            width: 200,
            key: 'outProjectCategory',
            dataIndex: 'outProjectCategory',
            scopedSlots: {customRender: 'outProjectCategory'},
          }, {
            title: '备注',
            width: 150,
            key: 'note',
            dataIndex: 'note',
          }, {
            title: '编辑分包',
            width: 130,
            fixed: 'right',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }],
        addVisible: false, // 弹出框控制
        formItemLayout,
        formTailLayout,
        addForm: this.$form.createForm(this),
        editForm: this.$form.createForm(this),
        editFormData: {}, // 编辑当前表单数据
        editVisible: false, // 编辑发票窗口控制
        editSpinning: false, // 编辑发票提交按钮
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.outContractOperation.paginationProps,// 分页控制
        tableData: state => state.outContractOperation.tableData, // 列表数据
        contractId: state => state.outContractOperation.contractId, // 合同号
        designId: state => state.outContractOperation.designId, // 设计号
        contractName: state => state.outContractOperation.contractName, // 合同名称
        outContractCategoryList: state => state.outContractCategoryOperation.outContractCategoryList, // 外包类型选项
        outProjectCategoryList: state => state.outProjectCategoryOperation.outProjectCategoryList, // 外包项目类型
      }),
    },
    mounted() {
      this.getOutContractCategoryList();
      this.getOutProjectCategoryList();
    },
    methods: {
      ...mapActions({
        getOutContractsByContractId: 'outContractOperation/getOutContractsByContractId',
        getContractIdsByIdLike: 'contractList/getContractIdsByIdLike',
        addOutContract: 'outContractOperation/addOutContract', // 添加分包合同
        deleteOutContract: 'outContractOperation/deleteOutContract',
        getOutContractCategoryList: 'outContractCategoryOperation/getOutContractCategoryList', // 获取分包类型
        getOutProjectCategoryList: 'outProjectCategoryOperation/getOutProjectCategoryList', // 获取分包项目类型
        verifyOutContract: 'outContractOperation/verifyOutContract', // 修改分包合同
      }),
      next() {
        this.current++;
        this.updateTableData();
      },
      prev() {
        this.current--
      },
      fetchOutContract(value) {
        const params = {
          contractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getContractIdsByIdLike(params).then((res) => {
          this.contractsData = res.data.data;
          this.fetching = false;
        });
      },
      handleChange(value) {
        Object.assign(this, {
          contractValue: value,
          contractsData: [],
          fetching: false,
        })
      },
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      handleInvoiceEdit(selectInvoiceData) {
        this.editFormData = JSON.parse(JSON.stringify(selectInvoiceData));
        this.editFormData.outContractDate = moment(this.editFormData.outContractDate);
        this.editVisible = true;
      },
      // 更新发票列表数据
      updateTableData() {
        this.tableSpinning = true;
        const params = {
          contractId: this.contractValue,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
        };
        this.getOutContractsByContractId(params).then((data) => {
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
      // 添加发票信息
      submitForm() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                contractId: this.contractValue,
                outContracts: [{
                  outContractId: values.outContractId,
                  outContractName: values.outContractName,
                  outCompanyName: values.outCompanyName,
                  outContractAmount: values.outContractAmount,
                  outPaid: values.outPaid,
                  outContractDate: values.outContractDate,
                  outContractCategory: {
                    outContractCategoryId: values.outContractCategory,
                  },
                  outProjectCategory: {
                    outProjectCategoryId: values.outProjectCategory,
                  },
                  note: values.note
                }],
              };
              this.addOutContract(params).then((res) => {
                this.$message.success(res.data.data);
                this.addForm.resetFields();
                this.updateTableData();
                this.addVisible = false;
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      onEditClose() {
        this.editVisible = false;
      },
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                outContractId: values.outContractId,
                outContractName: values.outContractName,
                outCompanyName: values.outCompanyName,
                outContractAmount: values.outContractAmount,
                outPaid: values.outPaid,
                outContractDate: values.outContractDate,
                outContractCategory: {
                  outContractCategoryId: values.outContractCategory,
                },
                outProjectCategory: {
                  outProjectCategoryId: values.outProjectCategory,
                },
                note: values.note
              };
              this.verifyOutContract(params).then((res) => {
                this.$message.success(res.data.data);
                this.editForm.resetFields();
                this.editVisible = false;
                this.updateTableData();
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      handleAddClose() {
        // 关闭添加弹窗后还原数据
        this.addForm.resetFields();
        this.invoiceFileList = [];
      },
      handleInvoiceDelete(selectInvoiceData) {
        const params = {
          outContractIds: [selectInvoiceData.outContractId]
        };
        this.deleteOutContract(params).then((res) => {
          this.updateTableData();
          this.$message.success(res.data.data)
        }).catch((error) => {
          this.$message.error(error);
        })
      }
    },
  }
</script>