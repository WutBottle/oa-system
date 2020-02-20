<style lang="scss" scoped>
  .InvoicePage {
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
        <a-breadcrumb-item>发票录入</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">发票录入<CashReceiptInput/></p>
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
                    @search="fetchContracts"
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
                         @change="handleTableChange" :scroll="{ x: 950, y: 450}">
                  <span slot="serial" slot-scope="text, record, index">
                  {{ index + 1 }}
                  </span>
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
                  <span slot="receiptClass" slot-scope="text">{{text ? '增值税专用发票' : '增值税普通发票'}}</span>
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
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
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
                  format="YYYY-MM-DD HH:mm:ss"
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
            <a-button>
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
                  format="YYYY-MM-DD HH:mm:ss"
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
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import {debounce} from 'debounce';
  import moment from 'moment'
  import CashReceiptInput from "../CashReceiptInput/CashReceiptInput";
  import baseUrl from '@/api/baseUrl'

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
        current: 0,
        steps: [{
          title: '选择合同号',
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
          }, {
            title: '开票日期',
            width: 100,
            key: 'receiptDate',
            dataIndex: 'receiptDate',
          }, {
            title: '发票金额(元)',
            width: 100,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
          }, {
            title: '发票类型',
            width: 100,
            key: 'receiptClass',
            dataIndex: 'receiptClass',
            scopedSlots: {customRender: 'receiptClass'}
          }, {
            title: '发票文件',
            width: 150,
            key: 'receiptFile',
            dataIndex: 'receiptFile',
            scopedSlots: {customRender: 'receiptFile'}
          }, {
            title: '编辑发票',
            width: 120,
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
          pageSizeOptions: ['5', '10', '15'], // 每页数量选项
          total: 0,
          current: 1,
        },
        tableData: [],
        contractId: '',
        designId: '',
        contractName: ''
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
          this.contractsData = res.data.data.contractIds;
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
        this.editForm.resetFields();
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
          pageLimit: this.paginationProps.pageSize
        };
        this.getReceiptsByContractId(params).then((res) => {
          if (res.data.data) {
            this.paginationProps.total = res.data.data.receipts.totalElements;
            this.contractId = res.data.data.contractId;
            this.designId = res.data.data.designId;
            this.contractName = res.data.data.contractName;
            this.tableData = res.data.data.receipts.content.map((item, index) => {
              return {
                key: index,
                receiptId: item.receiptId,
                receiptFile: item.receiptFile,
                receiptAmount: item.receiptAmount,
                receiptClass: item.receiptClass,
                receiptDate: moment(item.receiptDate).format('YYYY-MM-DD HH:mm:ss'),
                note: item.note,
              }
            });
          } else {
            this.current = 0;
            this.contractValue = undefined;
            this.$message.error(res.data.meta.message);
          }
          this.tableSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
        });
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
          receiptIds: [selectInvoiceData.receiptId]
        };
        this.deleteReceipt(params).then((res) => {
          this.updateTableData();
          this.$message.success(res.data.data)
        }).catch((error) => {
          this.$message.error(error);
        })
      }
    },
  }
</script>

