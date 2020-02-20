<style lang="scss" scoped>
  .ReceiptPage {
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
    <HeaderPage title="现金发票"/>
    <div class="page-content">
      <a-tabs @change="callback" style="background-color: #fff; padding: 10px 20px 40px 20px">
        <a-tab-pane tab="现金列表" key="cash">
          <a-form class="form-wrapper" :layout="formLayout">
            <a-form-item
                    label="合同号"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select
                      showSearch
                      :value="cashContractId"
                      placeholder="搜索合同号"
                      :showArrow="false"
                      style="width: 160px"
                      :filterOption="false"
                      @search="fetchCashContract"
                      @change="handleCashContractChange"
                      notFoundContent="无搜索结果"
                      :defaultActiveFirstOption="false"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
                <a-select-option v-for="d in contractsData" :key="d">{{d}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <div class="table-wrapper">
            <a-spin :spinning="cashSpinning" tip="Loading...">
              <a-table bordered :columns="cashColumns" :dataSource="cashListTableData"
                       :pagination="cashListPaginationProps"
                       @change="handleCashTableChange" :scroll="{ x: 'max-content', y: 500}">
                <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
                </span>
                <span slot="receipts" slot-scope="tags">
                  <a-tag v-for="tag in tags" color="blue"
                         :key="tag.id">{{tag.receiptId}}</a-tag>
                </span>
              </a-table>
            </a-spin>
          </div>
        </a-tab-pane>
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
              <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
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
  import HeaderPage from "../HeaderPage/HeaderPage";
  import {debounce} from 'debounce';
  import baseUrl from '@/api/baseUrl'

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
    components: {
      HeaderPage,
    },
    data() {
      this.fetchCashContract = debounce(this.fetchCashContract, 500);
      return {
        formItemLayout,
        formTailLayout,
        buttonItemLayout,
        formLayout: 'inline',
        receiptId: '', // 发票号
        receiptSpinning: false, // 发票加载控制
        receiptColumns: [
          {
            title: '序号',
            width: 70,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          },
          {
            title: '发票号',
            width: 150,
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
        cashContractId: '',// 现金回款查询合同号
        contractsData: [], // 获取的合同id列表
        fetching: false, // 查询合同号加载控制
        cashSpinning: false, // 现金回款加载控制
        cashColumns: [
          {
            title: '序号',
            width: 70,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          }, {
            title: '合同号',
            width: 120,
            key: 'contractId',
            dataIndex: 'contractId',
          }, {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
          }, {
            title: '设计号',
            width: 120,
            key: 'designId',
            dataIndex: 'designId',
          }, {
            title: '现金回款日期',
            width: 200,
            key: 'cashDate',
            dataIndex: 'cashDate',
          }, {
            title: '现金回款金额',
            width: 200,
            key: 'cashAmount',
            dataIndex: 'cashAmount',
          }, {
            title: '对应发票',
            width: 150,
            key: 'receipts',
            dataIndex: 'receipts',
            scopedSlots: {customRender: 'receipts'},
          },
        ], // 现金回款列表项
      }
    },
    computed: {
      ...mapState({
        receiptListData: state => state.receiptOperation.receiptListData,// 发票list数据
        receiptPaginationProps: state => state.receiptOperation.receiptPaginationProps,// 发票list分页数据
        cashListPaginationProps: state => state.cashOperation.cashListPaginationProps,// 现金列表分页数据
        cashListTableData: state => state.cashOperation.cashListTableData,// 现金回款table数据
      }),
    },
    methods: {
      ...mapActions({
        getReceiptListByIdLike: 'receiptOperation/getReceiptListByIdLike',
        getContractIdsByIdLike: 'contractList/getContractIdsByIdLike',
        getCashesByContractId: 'cashOperation/getCashesByContractId',
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
        const router = baseUrl.serverBaseController + file;
        window.open(router, '_blank');
      },
      // 控制发票分页
      handleReceiptTableChange(pagination) {
        this.receiptPaginationProps.current = pagination.current;
        this.receiptPaginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      // 合同模糊查询
      fetchCashContract(value) {
        const params = {
          contractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getContractIdsByIdLike(params).then((res) => {
          this.contractsData = res.data.data.contractIds;
          this.fetching = false;
        });
      },
      // 选择合同号处理
      handleCashContractChange(value) {
        Object.assign(this, {
          cashContractId: value,
          contractsData: [],
          fetching: false,
        });
        this.updateCashTableData();
      },
      // 控制现金回款列表分页
      handleCashTableChange(pagination) {
        this.cashListPaginationProps.current = pagination.current;
        this.cashListPaginationProps.pageSize = pagination.pageSize;
        this.updateCashTableData();
      },
      // 现金回款列表数据更新
      updateCashTableData() {
        this.cashSpinning = true;
        const params = {
          contractId: this.cashContractId,
          pageNum: this.cashListPaginationProps.current,
          pageLimit: this.cashListPaginationProps.pageSize
        };
        this.getCashesByContractId(params).then((data) => {
          this.cashSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
          this.cashSpinning = false;
        });
      },
    }
  }
</script>