<style lang="scss" scoped>
  .InvoicePage {
    .tr {
      text-align: right;
    }

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
  <div class="InvoicePage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>合同发票管理</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">合同发票管理<CashReceiptInput type="receipt"/></p>
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
                    @search="fetchContracts"
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
                         @change="handleTableChange" :scroll="{ x: 940, y: 450}">
                  <span slot="serial" slot-scope="text, record, index">
                  {{ index + 1 }}
                  </span>
                  <div slot="receiptAmount" slot-scope="text" class="tr">
                    {{numToMoney(text)}}
                  </div>
                  <span slot="operation" slot-scope="text, record">
                    <a @click="handleInvoiceEdit(record)">修改</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定删除？" @confirm="handleInvoiceDelete(record)" okText="确定" cancelText="取消">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                  <span slot="receiptFile" slot-scope="text">
                    <a-button :disabled="!text" type="primary" icon="eye"
                              @click="handleOpenFile(text)">
                      查看文件
                    </a-button>
                  </span>
                  <span slot="cashList" slot-scope="text, record">
                    <a-button type="primary" @click="openCashList(record)">
                      现金列表
                    </a-button>
                  </span>
                  <span slot="receiptClass" slot-scope="text">{{text ? '增值税专用发票' : '增值税普通发票'}}</span>
                </a-table>
                <a-statistic title="当前列表发票总额" :precision="2" :value="receiptTotal">
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
                label="发票号"
        >
          <a-input
                  v-decorator="[
          'receiptId',
          {rules: [{
            required: true, message: '请输入发票号!'
          }, {
            pattern: /^[0-9]{8}$/,
            message: '请输入8位数字',
          }]}
        ]"
                  placeholder="请输入发票号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="开票日期"
        >
          <a-date-picker
                  v-decorator="['receiptDate',  {
        rules: [{ type: 'object', required: true, message: '请输入开票日期!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="发票金额(元)"
        >
          <a-input
                  v-decorator="[
          'receiptAmount',
          {rules: [{
            required: true, message: '请输入发票金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入发票金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="发票类型"
        >
          <a-select
                  v-decorator="[
          'receiptClass',
          {rules: [{ required: true, message: '请选择发票类型！' }]}
        ]"
                  placeholder="请选择发票类型"
          >
            <a-select-option value="true">
              增值税专用发票
            </a-select-option>
            <a-select-option value="false">
              增值税普通发票
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="上传发票文件"
        >
          <a-upload
                  v-decorator="['uploadFile', {
          valuePropName: 'uploadFile',
        }]"
                  :fileList="invoiceFileList"
                  :beforeUpload="beforeInvoiceUpload"
                  :remove="handleInvoiceRemove"
                  :multiple="false"
          >
            <a-button :loading="!addSpinning">
              <a-icon type="upload"/>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
            title="修改发票信息"
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
                label="发票号"
        >
          <a-input
                  disabled
                  v-decorator="[
          'receiptId',
          {initialValue: this.editFormData.receiptId, rules: [{required: true, message: '请输入发票号!'}]}
        ]"
                  placeholder="请输入发票号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="开票日期"
        >
          <a-date-picker
                  v-decorator="[
          'receiptDate',
          {initialValue:this.editFormData.receiptDate, rules: [{ type: 'object', required: true, message: '请输入开票日期!' }]}
          ]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="发票金额(元)"
        >
          <a-input
                  v-decorator="[
          'receiptAmount',
          {initialValue: this.editFormData.receiptAmount, rules: [{
            required: true, message: '请输入发票金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入发票金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="发票类型"
        >
          <a-select
                  v-decorator="[
          'receiptClass',
          {initialValue: String(this.editFormData.receiptClass), rules: [{ required: true, message: '请选择发票类型！' }]}
        ]"
                  placeholder="请选择发票类型"
          >
            <a-select-option value="true">
              增值税专用发票
            </a-select-option>
            <a-select-option value="false">
              增值税普通发票
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="上传发票文件"
        >
          <a-upload
                  v-decorator="['uploadFile', {
          valuePropName: 'uploadFile',
        }]"
                  :fileList="editInvoiceFileList"
                  :beforeUpload="beforeEditInvoiceUpload"
                  :remove="handleEditInvoiceRemove"
                  :multiple="false"
          >
            <a-button>
              <a-icon type="upload"/>
              点击上传
            </a-button>
          </a-upload>
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
    <a-modal
            title="现金列表"
            v-model="cashVisible"
            width="600px"
            :footer="null"
    >
      <a-spin :spinning="cashTableSpinning">
        <a-table bordered :columns="cashColumns" :dataSource="cashTableData" :scroll="{ y: 500}">
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <div slot="cashAmount" slot-scope="text" style="text-align: right;">
            {{numToMoney(text)}}
          </div>
          <span slot="operation" slot-scope="text, record">
            <a-popconfirm title="确定删除？" @confirm="handleCashDelete(record)" okText="确定" cancelText="取消">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import {debounce} from 'debounce';
  import moment from 'moment'
  import CashReceiptInput from "../CashReceiptInput/CashReceiptInput";
  import baseUrl from '@/api/baseUrl';
  import api from '@/api/apiSugar';
  import numToMoney from '@utils/numToMoney';
  import {INFINITY} from "@/store/mutation-types";

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };

  export default {
    name: "InvoicePage",
    components: {
      CashReceiptInput,
    },
    data() {
      this.fetchContracts = debounce(this.fetchContracts, 500);
      return {
        numToMoney,
        current: 0,
        steps: [{
          title: '选择合同',
          type: 'searchContract',
        }, {
          title: '添加发票信息',
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
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          },
          {
            title: '发票号',
            width: 100,
            key: 'receiptId',
            dataIndex: 'receiptId',
            sorter: (a, b) => (b.receiptId || '').localeCompare(a.receiptId || ''),
          }, {
            title: '开票日期',
            width: 100,
            key: 'receiptDate',
            dataIndex: 'receiptDate',
            sorter: (a, b) => new Date(a.receiptDate) - new Date(b.receiptDate),
          }, {
            title: '发票金额(元)',
            width: 110,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
            sorter: (a, b) => a.receiptAmount - b.receiptAmount,
            scopedSlots: {customRender: 'receiptAmount'},
          }, {
            title: '发票类型',
            width: 100,
            key: 'receiptClass',
            dataIndex: 'receiptClass',
            scopedSlots: {customRender: 'receiptClass'}
          }, {
            title: '发票文件',
            width: 130,
            key: 'receiptFile',
            dataIndex: 'receiptFile',
            scopedSlots: {customRender: 'receiptFile'}
          }, {
            title: '现金列表',
            width: 100,
            key: 'cashList',
            dataIndex: 'cashList',
            scopedSlots: {customRender: 'cashList'}
          }, {
            title: '编辑发票',
            width: 100,
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }],
        addVisible: false, // 弹出框控制
        formItemLayout,
        formTailLayout,
        addForm: this.$form.createForm(this),
        editForm: this.$form.createForm(this),
        editFormData: {}, // 编辑当前表单数据
        invoiceFileList: [], // 发票文件
        editInvoiceFileList: [], // 编辑发票文件
        invoiceFileName: '', // 发票文件名称
        editInvoiceFileName: '', // 编辑发票文件名称
        editVisible: false, // 编辑发票窗口控制
        editSpinning: false, // 编辑发票提交按钮
        addSpinning: true, // 控制发票提交按钮
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40', 'Infinity'],// 每页数量选项
          total: 0,
          current: 1,
        },
        tableData: [],
        receiptTotal: 0,
        contractId: '',
        designId: '',
        contractName: '',
        cashVisible: false,
        cashTableSpinning: false,
        selectedReceiptId: '',
        cashTableData: [],
        cashColumns: [
          {
            title: '序号',
            width: 70,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          }, {
            title: '现金回款日期',
            width: 150,
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
          },  {
            title: '编辑操作',
            width: 120,
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }
        ],
      }
    },
    activated() {
      const {contractId = undefined} = this.$router.currentRoute.query;
      this.contractValue = contractId || this.contractValue;
      if (contractId) {
        this.current === 0 && this.current++;
        this.updateTableData();
      }
    },
    methods: {
      ...mapActions({
        getReceiptsByContractId: 'receiptOperation/getReceiptsByContractId',
        getContractIdsByIdLike: 'contractList/getContractIdsByIdLike',
        receiptUpload: 'receiptOperation/receiptUpload',
        addReceipt: 'receiptOperation/addReceipt',
        verifyReceipt: 'receiptOperation/verifyReceipt',
        deleteReceipt: 'receiptOperation/deleteReceipt'
      }),
      next() {
        this.current++;
        this.updateTableData();
      },
      prev() {
        this.current--
      },
      fetchContracts(value) {
        const params = {
          contractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.data = [];
        this.fetching = true;
        this.getContractIdsByIdLike(params).then((res) => {
          this.contractsData = res && res.data.data.content;
          this.fetching = false;
        });
      },
      handleChange(value) {
        Object.assign(this, {
          contractValue: value,
          fetching: false,
        })
      },
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      handleInvoiceEdit(selectInvoiceData) {
        this.editForm.resetFields();
        this.editInvoiceFileList = [];
        this.editInvoiceFileName = '';
        if (selectInvoiceData.receiptFile) {
          this.editInvoiceFileList.push({
            uid: '-1',
            name: selectInvoiceData.receiptFile.substring(selectInvoiceData.receiptFile.length - 9, selectInvoiceData.receiptFile.length),
            status: 'done',
            url: baseUrl.serverBaseController + selectInvoiceData.receiptFile,
          });
          this.editInvoiceFileName = selectInvoiceData.receiptFile;
        }
        this.editFormData = JSON.parse(JSON.stringify(selectInvoiceData));
        this.editFormData.receiptDate = moment(this.editFormData.receiptDate);
        this.editVisible = true;
      },
      // 查看pdf文件
      handleOpenFile(file) {
        const router = baseUrl.serverBaseController + file;
        window.open(router, '_blank');
      },
      // 更新发票列表数据
      updateTableData() {
        this.tableSpinning = true;
        const params = {
          contractId: this.contractValue,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize === Infinity ? INFINITY : this.paginationProps.pageSize,
        };
        this.getReceiptsByContractId(params).then((res) => {
          if (res.data.data) {
            this.paginationProps.total = res.data.data.receipts.totalElements;
            this.contractId = res.data.data.contractId;
            this.designId = res.data.data.designId;
            this.contractName = res.data.data.contractName;
            this.receiptTotal = 0;
            this.tableData = res.data.data.receipts.content.map((item, index) => {
              this.receiptTotal += item.receiptAmount;
              return {
                key: index,
                id: item.id,
                receiptId: item.receiptId,
                receiptFile: item.receiptFile,
                receiptAmount: item.receiptAmount,
                receiptClass: item.receiptClass,
                receiptDate: moment(item.receiptDate).format('YYYY-MM-DD'),
                note: item.note,
              }
            });
          } else {
            this.current = 0;
            this.contractValue = undefined;
            this.$message.error(res.data.meta.message);
          }
          this.tableSpinning = false;
        })
      },
      // 添加发票信息
      submitForm() {
        this.addSpinning && this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                contractId: this.contractId,
                receipts: [{
                  receiptId: values.receiptId,
                  receiptFile: this.invoiceFileName,
                  receiptAmount: values.receiptAmount,
                  receiptClass: values.receiptClass,
                  receiptDate: values.receiptDate,
                }],
              };
              this.addReceipt(params).then((res) => {
                if (res.data.meta.success) {
                  this.addForm.resetFields();
                  this.updateTableData();
                  this.addVisible = false;
                  this.$message.success(res.data.data);
                }else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      handleInvoiceRemove(file) {
        const index = this.invoiceFileList.indexOf(file);
        const newFileList = this.invoiceFileList.slice();
        newFileList.splice(index, 1);
        this.invoiceFileList = newFileList;
      },
      beforeInvoiceUpload(file) {
        this.addSpinning = false;
        this.handleInvoiceRemove(file);
        if (file.type === 'application/pdf') {
          const formData = new FormData();
          this.invoiceFileList = [...this.invoiceFileList, file];
          this.invoiceFileList.forEach((file) => {
            formData.append('multipartFiles', file);
          });
          // 手动上传
          this.receiptUpload(formData).then((data) => {
            this.invoiceFileName = data.data.data;
            this.$message.success('文件已上传');
            this.addSpinning = true;
          }).catch((error) => {
            this.$message.error('上传失败');
            this.addSpinning = true;
          });
        } else {
          this.$message.error('只能上传.pdf文件类型');
          this.handleInvoiceRemove(file);
          this.addSpinning = true;
        }
        return false;
      },
      handleEditInvoiceRemove(file) {
        const index = this.editInvoiceFileList.indexOf(file);
        const newFileList = this.editInvoiceFileList.slice();
        newFileList.splice(index, 1);
        this.editInvoiceFileList = newFileList;
        this.editInvoiceFileName = '';
      },
      beforeEditInvoiceUpload(file) {
        this.editSpinning = true;
        this.handleEditInvoiceRemove(file);
        if (file.type === 'application/pdf') {
          const formData = new FormData();
          this.editInvoiceFileList = [...this.editInvoiceFileList, file];
          this.editInvoiceFileList.forEach((file) => {
            formData.append('multipartFiles', file);
          });
          // 手动上传
          this.receiptUpload(formData).then((data) => {
            this.editInvoiceFileName = data.data.data;
            this.$message.success('文件已上传');
            this.editSpinning = false;
          }).catch((error) => {
            this.$message.error('上传失败');
            this.editSpinning = false;
          });
        } else {
          this.$message.error('只能上传.pdf文件类型');
          this.handleEditInvoiceRemove(file);
          this.editSpinning = false;
        }
        return false;
      },
      onEditClose() {
        this.editVisible = false;
      },
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                receiptId: values.receiptId,
                receiptFile: this.editInvoiceFileName,
                receiptAmount: values.receiptAmount,
                receiptClass: values.receiptClass,
                receiptDate: values.receiptDate,
              };
              this.verifyReceipt(params).then((res) => {
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
      handleAddClose() {
        // 关闭添加弹窗后还原数据
        this.addForm.resetFields();
        this.invoiceFileList = [];
      },
      handleFinalDelete(data) {
        const finalPage = Math.ceil(this.paginationProps.total / this.paginationProps.pageSize);
        if (this.tableData.length === data.receiptIds.length && this.paginationProps.current != 1 && this.paginationProps.current === finalPage) {
          this.paginationProps.current--;
        }
      },
      handleInvoiceDelete(selectInvoiceData) {
        const params = {
          receiptIds: [selectInvoiceData.receiptId]
        };
        this.deleteReceipt(params).then((res) => {
          if(res.data.meta.success){
            this.handleFinalDelete(params);
            this.updateTableData();
            this.$message.success(res.data.data)
          }else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      getCashesByReceiptId() {
        api.cashController.getCashesByReceiptId({
          receiptId: this.selectedReceiptId
        }).then(res => {
            if (res && res.data) {
              this.cashTableData = res.data.data.map((item, index) => {
                return {
                  key: index,
                  cashId: item.cash.cashId,
                  cashAmount: item.cash.cashAmount,
                  cashDate: moment(item.cash.cashDate).format('YYYY-MM-DD'),
                }
              });
              this.cashVisible = true;
            } else {
              this.$message.error('网络错误')
            }
        })

      },
      openCashList(data) {
        this.selectedReceiptId = data.id;
        this.getCashesByReceiptId();
      },
      handleCashDelete(data) {
        api.cashController.deleteCash({
          cashIds: [data.cashId]
        }).then((res) => {
          if (res && res.data.meta.success){
            this.getCashesByReceiptId();
            this.$message.success(res.data.data)
          } else {
            this.$message.error('网络错误')
          }
        })
      },
    },
  }
</script>

