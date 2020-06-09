<style lang="scss" scoped>
  .OutContractPaidPage {
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
  <div class="OutContractPaidPage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>分包付款管理</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">分包付款管理</p>
<!--      <p class="title">分包付款管理<OutPaidInput/></p>-->
    </div>
    <div class="page-content">
      <a-row style="background-color: #fff; padding: 24px;">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
        </a-steps>
        <div class="steps-content">
          <template v-if="steps[current].type === 'searchOutContract'">
            <a-select
                    showSearch
                    :value="outContractValue"
                    placeholder="搜索分包合同号、分包合同名称"
                    :showArrow="false"
                    style="width: 300px"
                    :filterOption="false"
                    @search="fetchOutContract"
                    @change="handleChange"
                    notFoundContent="无搜索结果"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in outContractsData" :key="d.outContractId">
                {{d.outContractId}}
                <a-divider type="vertical" />
                {{d.outContractName}}
              </a-select-option>
            </a-select>
          </template>
          <template v-else>
            <a-spin :spinning="tableSpinning">
              <div class="header-wrapper">
                <h3>合同号：{{this.contractId}}——合同名称：{{this.contractName}}——设计号：{{this.designId}}</h3>
                <h3>分包合同金额(元)：{{this.outContractAmount}}——分包合同号：{{this.outContractId}}——分包合同名称：{{this.outContractName}}——分包单位名称：{{this.outCompanyName}}</h3>
              </div>
              <div class="table-wrapper">
                <a-table bordered :columns="columns" :dataSource="tableData"
                         :pagination="paginationProps"
                         @change="handleTableChange" :scroll="{ x: 850, y: 450 }">
                  <span slot="serial" slot-scope="text, record, index">
                    {{ index + 1 }}
                  </span>
                  <span slot="receipts" slot-scope="tags">
                    <a-tag v-for="tag in tags" color="blue"
                           :key="tag.id">{{tag.receiptId}}</a-tag>
                  </span>
                  <span slot="operation" slot-scope="text, record">
                    <a @click="handleOutPaidEdit(record)">修改</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除？" @confirm="handleOutPaidDelete(record)" okText="确定" cancelText="取消">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                </a-table>
              </div>
            </a-spin>
          </template>
        </div>
        <div class="steps-action">
          <a-button
                  :disabled="this.outContractValue === undefined"
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
            title="新增分包付款"
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
                label="付费时间"
        >
          <a-date-picker
                  v-decorator="['paidDate',  {
        rules: [{ type: 'object', required: true, message: '请输入付费时间!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="付费金额(元)"
        >
          <a-input
                  v-decorator="[
          'paidAmount',
          {rules: [{
            required: true, message: '请输入付费金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入付费金额"
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
        <a-form-item
                v-bind="formItemLayout"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'paidNote',
          {rules: [{max: 250, message: '不超过250个字符'}]}
        ]"
                  placeholder="请输入备注"
          />
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
                label="分包付款Id"
        >
          <a-input
                  disabled
                  v-decorator="[
          'outPaidId',
          {initialValue: this.editFormData.outPaidId, rules: [{required: true, message: '请输入分包付款Id!'}]}
        ]"
                  placeholder="请输入分包付款Id"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="付费时间"
        >
          <a-date-picker
                  v-decorator="[
          'paidDate',
          {initialValue:this.editFormData.paidDate, rules: [{ type: 'object', required: true, message: '请输入付费时间!' }]}
          ]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="付费金额(元)"
        >
          <a-input
                  v-decorator="[
          'paidAmount',
          {initialValue: this.editFormData.paidAmount, rules: [{
            required: true, message: '请输入付费金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入付费金额"
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
                v-bind="formItemLayout"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'paidNote',
          {initialValue: this.editFormData.paidNote, rules: [{max: 250, message: '不超过250个字符'}]}
        ]"
                  placeholder="请输入备注"
          />
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

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };

  export default {
    name: "OutContractPaidPage",
    data() {
      this.fetchOutContract = debounce(this.fetchOutContract, 500);
      return {
        formItemLayout,
        formTailLayout,
        current: 0,
        steps: [{
          title: '选择分包合同',
          type: 'searchOutContract',
        }, {
          title: '添加分包付款信息',
          type: 'addInfo',
        }],
        outContractValue: undefined,
        outContractsData: [],
        fetching: false,
        addVisible: false,
        tableSpinning: false,
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
            title: '付费时间',
            width: 150,
            key: 'paidDate',
            dataIndex: 'paidDate',
          },
          {
            title: '付费金额(元)',
            width: 150,
            key: 'paidAmount',
            dataIndex: 'paidAmount',
          },
          {
            title: '对应发票',
            width: 200,
            key: 'receipts',
            dataIndex: 'receipts',
            scopedSlots: {customRender: 'receipts'},
          },
          {
            title: '备注',
            width: 150,
            key: 'paidNote',
            dataIndex: 'paidNote',
          },
          {
            title: '编辑分包付款',
            width: 130,
            fixed: 'right',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }
        ],
        addForm: this.$form.createForm(this),
        editForm: this.$form.createForm(this),
        editFormData: {}, // 编辑当前表单数据
        editVisible: false, // 编辑发票窗口控制
        editSpinning: false, // 编辑发票提交按钮
        receiptsList: [], // 发票列表
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.outPaidOperation.paginationProps,// 分页控制
        tableData: state => state.outPaidOperation.tableData, // table数据
        contractId: state => state.outPaidOperation.contractId, // 合同号
        contractName: state => state.outPaidOperation.contractName, // 合同名字
        designId: state => state.outPaidOperation.designId, // 设计号
        outContractAmount: state => state.outPaidOperation.outContractAmount, // 分包合同金额
        outContractId: state => state.outPaidOperation.outContractId, // 分包合同号
        outContractName: state => state.outPaidOperation.outContractName, // 分包合同名称
        outCompanyName: state => state.outPaidOperation.outCompanyName, // 分包单位名称
      }),
    },
    activated() {
      const {outContractId = undefined} = this.$router.currentRoute.query;
      this.outContractValue = outContractId;
      if (outContractId) {
        this.current++;
        this.updateTableData();
      }
    },
    methods: {
      ...mapActions({
        getOutContractIdsByIdLike: 'outContractOperation/getOutContractIdsByIdLike',
        getOutPaidsByOutContractId: 'outPaidOperation/getOutPaidsByOutContractId',
        deleteOutPaid: 'outPaidOperation/deleteOutPaid',
        addOutPaid: 'outPaidOperation/addOutPaid',
        verifyOutPaid: 'outPaidOperation/verifyOutPaid',
        getReceiptsByOutContractId: 'receiptOperation/getReceiptsByOutContractId',
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
          outContractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getOutContractIdsByIdLike(params).then((res) => {
          this.outContractsData = res && res.data.data.content;
          this.fetching = false;
        });
      },
      // 获取发票列表
      getReceiptList() {
        this.getReceiptsByOutContractId({
          outContractId: this.outContractValue
        }).then((res) => {
          this.receiptsList = res.data.data.receipts;
        })
      },
      handleChange(value) {
        Object.assign(this, {
          outContractValue: value,
          fetching: false,
        });
        this.getReceiptList();
      },
      // 更新分包付款列表数据
      updateTableData() {
        this.tableSpinning = true;
        const params = {
          outContractId: this.outContractValue,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
        };
        this.getOutPaidsByOutContractId(params).then((data) => {
          if (!data.data.data) {
            this.current = 0;
            this.outContractValue = undefined;
            this.$message.error(data.data.meta.message);
          }
          this.tableSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
          this.tableSpinning = false;
        });
      },
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      handleOutPaidEdit(selectOutPaidData) {
        this.editFormData = JSON.parse(JSON.stringify(selectOutPaidData));
        this.editFormData.paidDate = moment(this.editFormData.paidDate);
        this.editFormData.receipts = this.editFormData.receipts.map(item => {
          return item.id;
        });
        this.editVisible = true;
      },
      handleOutPaidDelete(selectOutPaidData) {
        const params = {
          outPaidIds: [selectOutPaidData.outPaidId]
        };
        this.deleteOutPaid(params).then((res) => {
          this.updateTableData();
          this.$message.success(res.data.data)
        }).catch((error) => {
          this.$message.error(error);
        })
      },
      handleAddClose() {
        // 关闭添加弹窗后还原数据
        this.addForm.resetFields();
      },
      submitForm() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                outContractId: this.outContractValue,
                outPaids: [{
                  paidDate: values.paidDate,
                  paidAmount: values.paidAmount,
                  paidNote: values.paidNote,
                  receipts: values.receipts.map(item => {
                    return {
                      id: item,
                    }
                  })
                }],
              };
              this.addOutPaid(params).then((res) => {
                if (res.data.meta.success){
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
      onEditClose() {
        this.editVisible = false;
      },
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                outPaidId: values.outPaidId,
                paidDate: values.paidDate,
                paidAmount: values.paidAmount,
                paidNote: values.paidNote,
                receipts: values.receipts.map(item => {
                  return {
                    id: item,
                  }
                })
              };
              this.verifyOutPaid(params).then((res) => {
                if (res.data.meta.success){
                  this.$message.success(res.data.data);
                  this.editForm.resetFields();
                  this.editVisible = false;
                  this.updateTableData();
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
    }
  }
</script>
