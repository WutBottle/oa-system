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
        <a-tab-pane tab="发票列表" key="receipt">
          <a-form class="form-wrapper" :layout="formLayout">
            <a-form-item
                    label="查询关键词"
            >
              <a-input v-model="receiptId" placeholder="发票号、合同号、合同名称"/>
            </a-form-item>
            <a-form-item
                    :wrapper-col="buttonItemLayout.wrapperCol"
            >
              <a-button type="primary" @click="handleReceiptQuery(true)">
                查询
              </a-button>
            </a-form-item>
            <a-form-item
                    :wrapper-col="buttonItemLayout.wrapperCol"
            >
              <a-button type="primary" icon="search" @click="() => this.queryReceiptVisible=true">精确查询</a-button>
            </a-form-item>
            <a-form-item>
              <a-popover title="发票选择列表" placement="bottom" trigger="click" v-model="popReceiptVisible">
                <template slot="content">
                  <div v-if="!!selectReceiptInfo.length" style="width: 350px">
                    <template v-for="(item, index) in selectReceiptInfo">
                      <div :key="index">
                        <span>{{index + 1}}</span>
                        <a-divider type="vertical"/>
                        <span>{{item.receiptId}}</span>
                        <a-divider type="vertical"/>
                        <span>{{item.receiptAmount}}元</span>
                      </div>
                    </template>
                  </div>
                  <a-empty v-else/>
                </template>
                <a-button type="dashed" @click="() => this.popReceiptVisible = true">
                  选择列表
                </a-button>
              </a-popover>
            </a-form-item>
            <a-form-item>
              <a-dropdown :trigger="['click']">
                <a-button icon="down" type="primary">
                  导出
                </a-button>
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a-button type="primary" @click="handleReceiptExport(false)">
                      选择导出
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a-button type="primary" @click="handleReceiptExport(true)">
                      全部导出
                    </a-button>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-form-item>
          </a-form>
          <div class="table-wrapper">
            <a-spin :spinning="receiptSpinning" tip="Loading...">
              <a-table bordered :columns="receiptColumns" :dataSource="receiptListData"
                       :pagination="receiptPaginationProps"
                       :rowSelection="{selectedRowKeys: selectedReceiptRowKeys, onSelect: onReceiptSelect, onSelectAll: onReceiptSelectAll, onChange: onReceiptSelectChange}"
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
              <div slot="receiptAmount" slot-scope="text" style="text-align: right">
                {{numToMoney(text)}}
              </div>
              <span slot="router" slot-scope="text, record">
                <a @click="jumpToReceiptManager(record)">管理</a>
              </span>
              </a-table>
            </a-spin>
          </div>
          <a-statistic title="当前列表发票总额" :precision="2" :value="currentReceiptTotal">
            <template v-slot:suffix>
              <span>元</span>
            </template>
          </a-statistic>
        </a-tab-pane>
        <a-tab-pane tab="现金列表" key="cash">
          <a-form class="form-wrapper" :layout="formLayout">
            <a-form-item
                    label="查询关键词"
            >
              <a-input v-model="cashContractId" placeholder="合同号、合同名称"/>
            </a-form-item>
            <a-form-item
                    :wrapper-col="buttonItemLayout.wrapperCol"
            >
              <a-button type="primary" @click="handleCashQuery(true)">
                查询
              </a-button>
            </a-form-item>
            <a-form-item
                    :wrapper-col="buttonItemLayout.wrapperCol"
            >
              <a-button type="primary" icon="search" @click="() => this.queryCashVisible=true">精确查询</a-button>
            </a-form-item>
            <a-form-item>
              <a-popover title="现金选择列表" placement="bottom" trigger="click" v-model="popCashVisible">
                <template slot="content">
                  <div v-if="!!selectCashInfo.length" style="width: 350px">
                    <template v-for="(item, index) in selectCashInfo">
                      <div :key="index">
                        <span>{{index + 1}}</span>
                        <a-divider type="vertical"/>
                        <span>{{item.cashDate}}</span>
                        <a-divider type="vertical"/>
                        <span>{{item.cashAmount}}元</span>
                      </div>
                    </template>
                  </div>
                  <a-empty v-else/>
                </template>
                <a-button type="dashed" @click="() => this.popCashVisible = true">
                  选择列表
                </a-button>
              </a-popover>
            </a-form-item>
            <a-form-item>
              <a-dropdown :trigger="['click']">
                <a-button icon="down" type="primary">
                  导出
                </a-button>
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a-button type="primary" @click="handleCashExport(false)">
                      选择导出
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a-button type="primary" @click="handleCashExport(true)">
                      全部导出
                    </a-button>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-form-item>
          </a-form>
          <div class="table-wrapper">
            <a-spin :spinning="cashSpinning" tip="Loading...">
              <a-table bordered :columns="cashColumns" :dataSource="cashListTableData"
                       :pagination="cashListPaginationProps"
                       :rowSelection="{selectedRowKeys: selectedCashRowKeys, onSelect: onCashSelect, onSelectAll: onCashSelectAll, onChange: onCashSelectChange}"
                       @change="handleCashTableChange" :scroll="{ x: 'max-content', y: 500}">
                <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
                </span>
                <div slot="cashAmount" slot-scope="text" style="text-align: right">
                  {{numToMoney(text)}}
                </div>
                <span slot="receipts" slot-scope="tags">
                  <a-tag v-for="tag in tags" color="blue"
                         :key="tag.id">{{tag.receiptId}}</a-tag>
                </span>
                <span slot="router" slot-scope="text, record">
                  <a @click="jumpToCashManager(record)">管理</a>
                </span>
              </a-table>
            </a-spin>
          </div>
          <a-statistic title="当前列表现金总额" :precision="2" :value="currentCashTotal">
            <template v-slot:suffix>
              <span>元</span>
            </template>
          </a-statistic>
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-drawer
            title="筛选条件"
            placement="right"
            :closable="false"
            @close="() => this.queryReceiptVisible = false"
            :visible="queryReceiptVisible"
            width="400"
    >
      <a-form formLayout="horizontal">
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="时间范围"
        >
          <a-range-picker style="width: 220px;" v-model="queryReceiptDate"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="金额范围"
        >
          <a-input-number :min="0" :max="Infinity" v-model="receiptLowerBound"
                          @blur="onChange('receiptLowerBound','receiptUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="receiptUpperBound"
                          @blur="onChange('receiptLowerBound','receiptUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="发票类型"
        >
          <a-select
                  :allowClear="true"
                  v-model="receiptClass"
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
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <a-button type="primary" @click="handleReceiptQuery(false)">
            查找
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
    <a-drawer
            title="筛选条件"
            placement="right"
            :closable="false"
            @close="() => this.queryCashVisible = false"
            :visible="queryCashVisible"
            width="400"
    >
      <a-form formLayout="horizontal">
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="时间范围"
        >
          <a-range-picker style="width: 220px;" v-model="queryCashDate"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="金额范围"
        >
          <a-input-number :min="0" :max="Infinity" v-model="cashLowerBound"
                          @blur="onChange('cashLowerBound','cashUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="cashUpperBound"
                          @blur="onChange('cashLowerBound','cashUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="是否EPC项目"
        >
          <a-select
                  :allowClear="true"
                  v-model="isEPC"
                  placeholder="是否EPC项目"
          >
            <a-select-option value="true">
              是
            </a-select-option>
            <a-select-option value="false">
              否
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目类型"
        >
          <a-select
                  :allowClear="true"
                  v-model="projectCategory"
                  placeholder="请选择项目类型"
          >
            <template v-for="item in this.projectCategoryList">
              <a-select-option :key="item.categoryId" :value="item.categoryId">
                {{item.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <a-button type="primary" @click="handleCashQuery(false)">
            查找
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import HeaderPage from "../HeaderPage/HeaderPage";
  import baseUrl from '@/api/baseUrl'
  import moment from "moment";
  import numToMoney from "@utils/numToMoney";
  import {INFINITY} from "@/store/mutation-types";

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
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
      return {
        numToMoney,
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
            sorter: (a, b) => (b.receiptId || '').localeCompare(a.receiptId || ''),
          },
          {
            title: '设计号',
            width: 200,
            key: 'designId',
            dataIndex: 'designId',
            sorter: (a, b) => (b.designId || '').localeCompare(a.designId || ''),
          },
          {
            title: '合同号',
            width: 200,
            key: 'contractId',
            dataIndex: 'contractId',
            sorter: (a, b) => (b.contractId || '').localeCompare(a.contractId || ''),
          },
          {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
            sorter: (a, b) => (b.contractName || '').localeCompare(a.contractName || ''),
          },
          {
            title: '开票日期',
            width: 150,
            key: 'receiptDate',
            dataIndex: 'receiptDate',
            sorter: (a, b) => new Date(a.receiptDate) - new Date(b.receiptDate),
          },
          {
            title: '发票金额',
            width: 150,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
            sorter: (a, b) => a.receiptAmount - b.receiptAmount,
            scopedSlots: {customRender: 'receiptAmount'}
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
          {
            title: '合同发票',
            key: 'router',
            width: 100,
            dataIndex: 'router',
            scopedSlots: {customRender: 'router'}
          },
        ], // 发票列表项
        cashContractId: '',// 现金回款查询合同号
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
            sorter: (a, b) => (b.contractId || '').localeCompare(a.contractId || ''),
          }, {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
            sorter: (a, b) => (b.contractName || '').localeCompare(a.contractName || ''),
          }, {
            title: '设计号',
            width: 120,
            key: 'designId',
            dataIndex: 'designId',
            sorter: (a, b) => (b.designId || '').localeCompare(a.designId || ''),
          }, {
            title: '现金回款日期',
            width: 150,
            key: 'cashDate',
            dataIndex: 'cashDate',
            sorter: (a, b) => new Date(a.cashDate) - new Date(b.cashDate),
          }, {
            title: '现金回款金额',
            width: 200,
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
            title: '合同现金',
            key: 'router',
            width: 100,
            dataIndex: 'router',
            scopedSlots: {customRender: 'router'}
          },
        ], // 现金回款列表项
        popReceiptVisible: false,
        selectedReceiptRowKeys: [],
        popCashVisible: false,
        selectedCashRowKeys: [],
        queryReceiptVisible: false,
        queryReceiptDate: [], // 精确查询发票时间范围
        receiptLowerBound: null, // 发票金额上限
        receiptUpperBound: null, // 发票金额下限
        receiptClass: undefined, // 发票类型
        queryCashVisible: false,
        queryCashDate: [], // 精确查询现金时间范围
        cashLowerBound: null, // 发票金额上限
        cashUpperBound: null, // 发票金额下限
        isEPC: undefined, // 是否epc项目
        projectCategoryList: [],
        projectCategory: undefined, // 项目类别
      }
    },
    computed: {
      ...mapState({
        receiptListData: state => state.receiptOperation.receiptListData,// 发票list数据
        currentReceiptTotal: state => state.receiptOperation.currentReceiptTotal, // 发票总额
        receiptPaginationProps: state => state.receiptOperation.receiptPaginationProps,// 发票list分页数据
        selectReceiptInfo: state => state.receiptOperation.selectReceiptInfo, // 选中的发票信息
        cashListPaginationProps: state => state.cashOperation.cashListPaginationProps,// 现金列表分页数据
        cashListTableData: state => state.cashOperation.cashListTableData,// 现金回款table数据
        currentCashTotal: state => state.cashOperation.currentCashTotal,// 现金回款总额
        selectCashInfo: state => state.cashOperation.selectCashInfo,
      }),
    },
    mounted() {
      this.getCategoryList({
        categoryType: 3
      }).then(res => {
        this.projectCategoryList = res && res.data.data;
      });
    },
    activated() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        getReceiptListByIdLike: 'receiptOperation/getReceiptListByIdLike',
        getCashesByIdLike: 'cashOperation/getCashesByIdLike',
        receiptExport: 'receiptOperation/receiptExport',
        cashExport: 'cashOperation/cashExport',
        getCategoryList: 'categoryOperation/getCategoryList', // 获取类型
      }),
      handleReceiptReset() {
        Object.assign(this, {
          queryReceiptDate: [], // 精确查询发票时间范围
          receiptLowerBound: null, // 发票金额上限
          receiptUpperBound: null, // 发票金额下限
          receiptClass: undefined, // 发票类型
        })
      },
      handleReceiptQuery(isReset) {
        if (isReset) {
          this.handleReceiptReset();
        }
        this.receiptPaginationProps.current = 1;
        this.updateTableData();
      },
      // 获取发票信息列表
      updateTableData() {
        this.receiptSpinning = true;
        let actualDate;

        if (this.queryReceiptDate.length) {
          actualDate = [moment(this.queryReceiptDate[0]).format('YYYY-MM-DD'), moment(this.queryReceiptDate[1]).format('YYYY-MM-DD')]
        } else {
          actualDate = ['', '']
        }

        const params = {
          receiptId: this.receiptId,
          actualDate: actualDate,
          receiptAmount: [this.receiptLowerBound ? String(this.receiptLowerBound) : '', this.receiptUpperBound ? String(this.receiptUpperBound) : ''],
          receiptClass: this.receiptClass,
          pageNum: this.receiptPaginationProps.current,
          pageLimit: this.receiptPaginationProps.pageSize === Infinity ? INFINITY : this.receiptPaginationProps.pageSize,
        };
        this.getReceiptListByIdLike(params).then((res) => {
          if (res && res.data.meta.success){
            this.selectedReceiptRowKeys = [];
            this.receiptListData.map((item, index) => {
              if (item.selectIndex) {
                this.selectedReceiptRowKeys.push(index);
              }
            });
            this.queryReceiptVisible = false;
          }else {
            this.$message.error("服务器错误");
          }
          this.receiptSpinning = false;
        })
      },
      callback(key) {
        if (key === 'receipt') {
          this.updateTableData();
        } else {
          this.updateCashTableData();
        }
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
      // 控制现金回款列表分页
      handleCashTableChange(pagination) {
        this.cashListPaginationProps.current = pagination.current;
        this.cashListPaginationProps.pageSize = pagination.pageSize;
        this.updateCashTableData();
      },
      handleCashReset() {
        Object.assign(this, {
          queryCashDate: [], // 精确查询现金时间范围
          cashLowerBound: null, // 发票金额上限
          cashUpperBound: null, // 发票金额下限
        })
      },
      handleCashQuery(isReset) {
        if (isReset) {
          this.handleCashReset();
        }
        this.cashListPaginationProps.current = 1;
        this.updateCashTableData();
      },
      // 现金回款列表数据更新
      updateCashTableData() {
        this.cashSpinning = true;

        let actualDate;
        if (this.queryCashDate.length) {
          actualDate = [moment(this.queryCashDate[0]).format('YYYY-MM-DD'), moment(this.queryCashDate[1]).format('YYYY-MM-DD')]
        } else {
          actualDate = ['', '']
        }

        const params = {
          contractId: this.cashContractId,
          actualDate: actualDate,
          cashAmount: [this.cashLowerBound ? String(this.cashLowerBound) : '', this.cashUpperBound ? String(this.cashUpperBound) : ''],
          pageNum: this.cashListPaginationProps.current,
          pageLimit: this.cashListPaginationProps.pageSize === Infinity ? INFINITY : this.cashListPaginationProps.pageSize,
        };
        this.getCashesByIdLike(params).then((res) => {
          if (res && res.data.meta.success) {
            this.selectedCashRowKeys = [];
            this.cashListTableData.map((item, index) => {
              if (item.selectIndex) {
                this.selectedCashRowKeys.push(index);
              }
            });
            this.queryCashVisible = false;
          }else {
            this.$message.error("服务器错误");
          }
          this.cashSpinning = false;
        })
      },
      removeReceiptInfo(id) {
        this.selectReceiptInfo.splice(this.selectReceiptInfo.findIndex(item => item.id === id), 1);
      },
      // 处理发票移除
      handleReceiptRemoved(rowData) {
        rowData.selectIndex = false;
        this.removeReceiptInfo(rowData.id);
        this.popReceiptVisible = true;
      },
      // 处理发票选择
      handleReceiptSelected(rowData) {
        rowData.selectIndex = true;
        this.selectReceiptInfo.push({
          id: rowData.id,
          receiptId: rowData.receiptId,
          receiptAmount: rowData.receiptAmount
        });
        this.popReceiptVisible = true;
      },
      onReceiptSelect(record, selected, selectedRows) {
        if (record.selectIndex) {
          this.handleReceiptRemoved(record);
        } else {
          this.handleReceiptSelected(record);
        }
      },
      onReceiptSelectChange(selectedRowKeys) {
        this.selectedReceiptRowKeys = selectedRowKeys;
      },
      onReceiptSelectAll(selected, selectedRows, changeRows) {
        changeRows.map(item => {
          if (item.selectIndex) {
            this.handleReceiptRemoved(item);
          } else {
            this.handleReceiptSelected(item);
          }
        });
      },
      removeCashInfo(id) {
        this.selectCashInfo.splice(this.selectCashInfo.findIndex(item => item.cashId === id), 1);
      },
      // 处理发票移除
      handleCashRemoved(rowData) {
        rowData.selectIndex = false;
        this.removeCashInfo(rowData.cashId);
        this.popCashVisible = true;
      },
      // 处理发票选择
      handleCashSelected(rowData) {
        rowData.selectIndex = true;
        this.selectCashInfo.push({
          cashId: rowData.cashId,
          cashAmount: rowData.cashAmount,
          cashDate: rowData.cashDate,
        });
        this.popCashVisible = true;
      },
      onCashSelect(record, selected, selectedRows) {
        if (record.selectIndex) {
          this.handleCashRemoved(record);
        } else {
          this.handleCashSelected(record);
        }
      },
      onCashSelectChange(selectedRowKeys) {
        this.selectedCashRowKeys = selectedRowKeys;
      },
      onCashSelectAll(selected, selectedRows, changeRows) {
        changeRows.map(item => {
          if (item.selectIndex) {
            this.handleCashRemoved(item);
          } else {
            this.handleCashSelected(item);
          }
        });
      },
      handleReceiptExport(type) {
        let fileName = '发票导出.xlsx';
        if (this.selectReceiptInfo.length || type) {
          this.receiptExport({
            receiptIds: this.selectReceiptInfo.map((item) => {
              return item.id.toString()
            }),
            all: type,
          }).then((data) => {
            if (!data.data) {
              return
            }
            if ('msSaveOrOpenBlob' in navigator) { // IE下导出
              window.navigator.msSaveOrOpenBlob(new Blob([data.data]), fileName);//设置导出的文件名
            } else {
              let url = window.URL.createObjectURL(new Blob([data.data]));
              let link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
            }
            this.$message.success("导出成功");
          }).catch((error) => {
            this.$message.error("导出失败");
          });
        }else {
          this.$message.warning('您的选择列表为空！');
        }
      },
      handleCashExport(type) {
        let fileName = '现金导出.xlsx';
        if (this.selectCashInfo.length || type) {
          this.cashExport({
            cashIds: this.selectCashInfo.map((item) => {
              return item.cashId.toString()
            }),
            all: type,
          }).then((data) => {
            if (!data.data) {
              return
            }
            if ('msSaveOrOpenBlob' in navigator) { // IE下导出
              window.navigator.msSaveOrOpenBlob(new Blob([data.data]), fileName);//设置导出的文件名
            } else {
              let url = window.URL.createObjectURL(new Blob([data.data]));
              let link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
            }
            this.$message.success("导出成功");
          }).catch((error) => {
            this.$message.error("导出失败");
          });
        }else {
          this.$message.warning('您的选择列表为空！');
        }
      },
      onChange(lowerBound, upperBound) {
        if (this[lowerBound] && this[upperBound] && this[upperBound] < this[lowerBound]) {
          let temp = this[lowerBound];
          this[lowerBound] = this[upperBound];
          this[upperBound] = temp;
        }
      },
      jumpToReceiptManager(data) {
        this.$router.push({
          path: '/main/invoice',
          query: {contractId: data.contractId}
        })
      },
      jumpToCashManager(data) {
        this.$router.push({
          path: '/main/cash',
          query: {contractId: data.contractId}
        })
      },
    }
  }
</script>