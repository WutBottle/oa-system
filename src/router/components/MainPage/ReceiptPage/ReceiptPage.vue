<style lang="scss" scoped>
  .ReceiptPage {
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
      padding: 24px;

      .form-wrapper {
        padding-bottom: 20px;
      }
    }
  }
</style>

<template>
  <div class="ReceiptPage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>现金发票</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">现金发票</p>
    </div>
    <div class="page-content">
      <a-tabs @change="callback" style="background-color: #fff; padding: 10px 20px 40px 20px">
        <a-tab-pane tab="现金列表" key="cash">Content of Tab Pane 1</a-tab-pane>
        <a-tab-pane tab="发票列表" key="receipt">
          <a-form class="form-wrapper" :layout="formLayout">
            <a-form-item
                    label="发票号"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input v-model="receiptId" placeholder="请输入发票号"/>
            </a-form-item>
            <a-form-item
                    :wrapper-col="buttonItemLayout.wrapperCol"
            >
              <a-button type="primary" @click="handleReceiptQuery">
                查询
              </a-button>
            </a-form-item>
          </a-form>
          <div class="table-wrapper">
            <a-spin :spinning="receiptSpinning" tip="Loading...">
              <a-table bordered :columns="receiptColumns" :dataSource="receiptListData"
                       :pagination="receiptPaginationProps"
                       @change="handleReceiptTableChange" :scroll="{ x: 'max-content', y: 500}">
              <span slot="receiptFile" slot-scope="text">
                <a-button :disabled="!text" type="primary" icon="eye"
                          @click="handleOpenReceiptFile(text)">
                  查看文件
                </a-button>
              </span>
              </a-table>
            </a-spin>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  const buttonItemLayout = {
    wrapperCol: {span: 14, offset: 0}
  };
  export default {
    name: "ReceiptPage",
    data() {
      return {
        formItemLayout,
        formTailLayout,
        buttonItemLayout,
        formLayout: 'inline',
        receiptId: '', // 发票号
        receiptSpinning: false, // 发票加载控制
        receiptColumns: [
          {
            title: '发票号',
            width: 200,
            fixed: 'left',
            key: 'receiptId',
            dataIndex: 'receiptId',
          },
          {
            title: '设计号',
            width: 200,
            key: 'designId',
            dataIndex: 'designId',
          },
          {
            title: '合同号',
            width: 200,
            key: 'contractId',
            dataIndex: 'contractId',
          },
          {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
          },
          {
            title: '开票日期',
            width: 200,
            key: 'receiptDate',
            dataIndex: 'receiptDate',
          },
          {
            title: '发票金额',
            width: 150,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
          },
          {
            title: '发票类型',
            width: 150,
            key: 'receiptClass',
            dataIndex: 'receiptClass',
          },
          {
            title: '发票文件',
            key: 'receiptFile',
            width: 150,
            dataIndex: 'receiptFile',
            scopedSlots: {customRender: 'receiptFile'}
          },
        ], // 发票列表项
      }
    },
    computed: {
      ...mapState({
        receiptListData: state => state.receiptOperation.receiptListData,// 发票list数据
        receiptPaginationProps: state => state.receiptOperation.receiptPaginationProps,// 发票list分页数据
      }),
    },
    methods: {
      ...mapActions({
        getReceiptListByIdLike: 'receiptOperation/getReceiptListByIdLike',
      }),
      // 获取发票信息列表
      updateTableData() {
        this.receiptSpinning = true;
        const params = {
          receiptId: this.receiptId,
          pageNum: this.receiptPaginationProps.current,
          pageLimit: this.receiptPaginationProps.pageSize
        };
        this.getReceiptListByIdLike(params).then((res) => {
          this.receiptSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
          this.receiptSpinning = false;
        })
      },
      callback(key) {
        if (key === 'cash') {

        } else {
          this.updateTableData();
        }
      },
      // 发票查询
      handleReceiptQuery() {
        this.updateTableData();
      },
      // 查看发票文件
      handleOpenReceiptFile(file) {
        const router = 'http://172.15.67.120:8081/' + file;
        window.open(router, '_blank');
      },
      // 控制发票分页
      handleReceiptTableChange(pagination) {
        this.receiptPaginationProps.current = pagination.current;
        this.receiptPaginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
    }
  }
</script>