<style lang="scss" scoped>
  .OutContractReceiptPage {
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
  <div class="OutContractReceiptPage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>分包发票管理</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">分包发票管理<CashReceiptInput type="outReceipt"/></p>
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
                    @search="fetchOutContracts"
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
                <h3>分包合同号：{{this.outContractId}}——分包名称：{{this.outContractName}}——分包单位：{{this.outCompanyName}}</h3>
              </div>
              <div class="table-wrapper">
                <a-table bordered :columns="columns" :dataSource="tableData"
                         :pagination="paginationProps"
                         @change="handleTableChange" :scroll="{ x: 1220, y: 450}">
                  <span slot="serial" slot-scope="text, record, index">
                  {{ index + 1 }}
                  </span>
                  <div slot="receiptAmount" slot-scope="text" style="text-align: right">
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
  </div>
</template>

<script>
  import baseUrl from '@/api/baseUrl'
  import {mapActions} from 'vuex';
  import {debounce} from 'debounce';
  import moment from 'moment';
  import CashReceiptInput from "../CashReceiptInput/CashReceiptInput";
  import numToMoney from "@utils/numToMoney";
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
    name: "OutContractReceiptPage",
    components: {
      CashReceiptInput,
    },
    data() {
      this.fetchContracts = debounce(this.fetchContracts, 500);
      return {
        current: 0,
        steps: [{
          title: '选择分包合同',
          type: 'searchOutContract',
        }, {
          title: '添加发票信息',
          type: 'addInfo',
        }],
        numToMoney,
        formItemLayout,
        formTailLayout,
        addForm: this.$form.createForm(this),
        editForm: this.$form.createForm(this),
        outContractValue: undefined,
        outContractsData: [],
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
          },
          {
            title: '发票号',
            width: 150,
            key: 'receiptId',
            dataIndex: 'receiptId',
            sorter: (a, b) => (b.receiptId || '').localeCompare(a.receiptId || ''),
          }, {
            title: '开票日期',
            width: 150,
            key: 'receiptDate',
            dataIndex: 'receiptDate',
            sorter: (a, b) => new Date(a.receiptDate) - new Date(b.receiptDate),
          }, {
            title: '发票金额(元)',
            width: 250,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
            sorter: (a, b) => a.receiptAmount - b.receiptAmount,
            scopedSlots: {customRender: 'receiptAmount'}
          }, {
            title: '发票类型',
            width: 200,
            key: 'receiptClass',
            dataIndex: 'receiptClass',
            scopedSlots: {customRender: 'receiptClass'}
          }, {
            title: '发票文件',
            width: 200,
            key: 'receiptFile',
            dataIndex: 'receiptFile',
            scopedSlots: {customRender: 'receiptFile'}
          }, {
            title: '编辑发票',
            width: 200,
            fixed: 'right',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }],
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40', 'Infinity'], // 每页数量选项
          total: 0,
          current: 1,
        },
        tableData: [],
        receiptTotal: 0,
        outContractId: '',
        outContractName: '',
        outCompanyName: '',
        addVisible: false,
        addSpinning: true,
        invoiceFileList: [], // 发票文件
        invoiceFileName: '', // 发票文件名称
        editVisible: false,
        editFormData: {}, // 编辑当前表单数据
        editSpinning: false, // 编辑发票提交按钮
        editInvoiceFileList: [], // 编辑发票文件
      }
    },
    activated() {
      const {outContractId = undefined} = this.$router.currentRoute.query;
      this.outContractValue = outContractId || this.outContractValue;
      if (outContractId) {
        this.current === 0 && this.current++;
        this.updateTableData();
      }
    },
    methods: {
      ...mapActions({
        getOutContractIdsByIdLike: 'outContractOperation/getOutContractIdsByIdLike',
        getReceiptsByOutContractId: 'receiptOperation/getReceiptsByOutContractId',
        deleteOutReceipt: 'receiptOperation/deleteOutReceipt',
        receiptUpload: 'receiptOperation/receiptUpload',
        addOutReceipt: 'receiptOperation/addOutReceipt',
        verifyOutReceipt: 'receiptOperation/verifyOutReceipt'
      }),
      next() {
        this.current++;
        this.updateTableData();
      },
      prev() {
        this.current--
      },
      fetchOutContracts(value) {
        const params = {
          outContractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.data = [];
        this.fetching = true;
        this.getOutContractIdsByIdLike(params).then((res) => {
          this.outContractsData = res && res.data.data.content;
          this.fetching = false;
        });
      },
      handleChange(value) {
        Object.assign(this, {
          outContractValue: value,
          fetching: false,
        })
      },
      // 更新发票列表数据
      updateTableData() {
        this.tableSpinning = true;
        const params = {
          outContractId: this.outContractValue,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize === Infinity ? INFINITY : this.paginationProps.pageSize,
        };
        this.getReceiptsByOutContractId(params).then((res) => {
          if (res.data.data) {
            this.paginationProps.total = res.data.data.receipts.totalElements;
            this.outContractId = res.data.data.outContractId;
            this.outContractName = res.data.data.outContractName;
            this.outCompanyName = res.data.data.outCompanyName;
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
            this.outContractValue = undefined;
            this.$message.error(res.data.meta.message);
          }
          this.tableSpinning = false;
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
        this.deleteOutReceipt(params).then((res) => {
          if(res.data.meta.success){
            this.handleFinalDelete(params);
            this.updateTableData();
            this.$message.success(res.data.data)
          }else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      // 查看pdf文件
      handleOpenFile(file) {
        const router = baseUrl.serverBaseController + file;
        window.open(router, '_blank');
      },
      handleAddClose() {
        // 关闭添加弹窗后还原数据
        this.addForm.resetFields();
        this.invoiceFileList = [];
      },
      // 添加发票信息
      submitForm() {
        this.addSpinning && this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                outContractId: this.outContractId,
                receipts: [{
                  receiptId: values.receiptId,
                  receiptFile: this.invoiceFileName,
                  receiptAmount: values.receiptAmount,
                  receiptClass: values.receiptClass,
                  receiptDate: values.receiptDate,
                }],
              };
              this.addOutReceipt(params).then((res) => {
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
      handleInvoiceRemove(file) {
        const index = this.invoiceFileList.indexOf(file);
        const newFileList = this.invoiceFileList.slice();
        newFileList.splice(index, 1);
        this.invoiceFileList = newFileList;
      },
      onEditClose() {
        this.editVisible = false;
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
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                id: this.editFormData.id,
                receiptId: values.receiptId,
                receiptFile: this.editInvoiceFileName,
                receiptAmount: values.receiptAmount,
                receiptClass: values.receiptClass,
                receiptDate: values.receiptDate,
              };
              this.verifyOutReceipt(params).then((res) => {
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