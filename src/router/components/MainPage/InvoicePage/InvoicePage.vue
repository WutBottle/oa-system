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
        padding-top: 80px;

        .form-wrapper {
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
      <p class="title">发票录入</p>
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
            <a-form class="form-wrapper" :layout="formLayout">
              <a-form-item
                      label="发票号"
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
              >
                <a-input v-model="invoiceId" placeholder="请输入发票号"/>
              </a-form-item>
              <a-form-item
                      :wrapper-col="buttonItemLayout.wrapperCol"
              >
                <a-button type="primary" @click="handleQuery">
                  查询
                </a-button>
              </a-form-item>
            </a-form>
            <div class="table-wrapper">
              <a-spin :spinning="spinning" tip="Loading...">
                <a-table bordered :columns="columns" :dataSource="tableData"
                         :pagination="paginationProps"
                         @change="handleTableChange" :scroll="{ x: 'max-content', y: 500}">
                  <a slot="operation" slot-scope="text, record" @click="handleContractEdit(record)">修改</a>
                  <span slot="receiptFile" slot-scope="text">
                    <a-button type="primary" icon="eye"
                              @click="handleOpenFile(text)">
                      查看文件
                    </a-button>
                  </span>
                </a-table>
              </a-spin>
            </div>
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
                  @click="$message.success('Processing complete!')"
          >
            完成
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
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import {debounce} from 'debounce';

  export default {
    name: "InvoicePage",
    data() {
      this.fetchContracts = debounce(this.fetchContracts, 800);
      return {
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
        formItemLayout: {
          labelCol: {span: 5},
          wrapperCol: {span: 16}
        },
        buttonItemLayout: {
          wrapperCol: {span: 14, offset: 0}
        },
        invoiceId: '', // 发票id
        spinning: false,
        columns: [
          {
            title: '发票号',
            width: 150,
            fixed: 'left',
            key: 'receiptId',
            dataIndex: 'receiptId',
          }, {
            title: '设计号',
            width: 150,
            key: 'designId',
            dataIndex: 'designId',
          }, {
            title: '合同号',
            width: 150,
            key: 'contractId',
            dataIndex: 'contractId',
          }, {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
          }, {
            title: '开票日期',
            width: 200,
            key: 'receiptDate',
            dataIndex: 'receiptDate',
          }, {
            title: '发票金额',
            width: 150,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
          }, {
            title: '发票类型',
            width: 200,
            key: 'receiptClass',
            dataIndex: 'receiptClass',
          }, {
            title: '发票文件',
            width: 200,
            key: 'receiptFile',
            dataIndex: 'receiptFile',
            scopedSlots: {customRender: 'receiptFile'}
          }, {
            title: '编辑发票',
            key: 'operation',
            fixed: 'right',
            width: 150,
            scopedSlots: {customRender: 'operation'},
          }],
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.receiptOperation.paginationProps,// 分页控制
        tableData: state => state.receiptOperation.tableData, // 列表数据
      }),
    },
    methods: {
      ...mapActions({
        getReceiptsByContractId: 'receiptOperation/getReceiptsByContractId',
        getContractIdsByIdLike: 'contractList/getContractIdsByIdLike',
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
      handleQuery() {
        this.updateTableData();
      },
      handleTableChange(pagination) {
        this.spinning = true;
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.spinning = false;
      },
      handleContractEdit(selectInvoiceData) {

      },
      // 查看pdf文件
      handleOpenFile(file) {
        const router = 'http://172.15.67.120:8081/' + file;
        window.open(router, '_blank');
      },
      updateTableData() {
        const params = {
          contractId: this.contractValue,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
        };
        this.getReceiptsByContractId(params).then((data) => {

        }).catch((error) => {
          this.$message.error(error);
        });
      },
    },
  }
</script>

