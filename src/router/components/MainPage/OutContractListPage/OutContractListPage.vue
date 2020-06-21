<style lang="scss" scoped>
  .OutContractListPage {
    .tr {
      text-align: right;
    }

    .page-content {
      padding: 24px;

      .content-wrapper {
        position: relative;
        overflow: hidden;
        padding: 24px 32px;
        background-color: #fff;

        .form-wrapper {
          margin-bottom: 18px;
        }
      }
    }
  }
</style>

<template>
  <div class="OutContractListPage">
    <HeaderPage title="分包列表"/>
    <div class="page-content">
      <div class="content-wrapper">
        <a-form class="form-wrapper" :layout="formLayout">
          <a-form-item
                  label="查询关键词"
          >
            <a-input style="width: 200px" v-model="outContractId" placeholder="分包合同号、分包名称"/>
          </a-form-item>
          <a-form-item
                  :wrapper-col="buttonItemLayout.wrapperCol"
          >
            <a-button type="primary" @click="handleQuery(true)">
              查询
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="handleAccurateQuery">精确查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-popover title="分包合同选择列表" placement="bottom" trigger="click" v-model="popVisible">
              <template slot="content">
                <div v-if="!!selectOutContractInfo.length" style="width: 350px">
                  <template v-for="(item, index) in selectOutContractInfo">
                    <div :key="index">
                      <span>{{index + 1}}</span>
                      <a-divider type="vertical"/>
                      <span>{{item.outContractId}}</span>
                      <a-divider type="vertical"/>
                      <span>{{item.outContractName}}</span>
                    </div>
                  </template>
                </div>
                <a-empty v-else/>
              </template>
              <a-button type="dashed" @click="() => this.popVisible = true">
                选择列表
              </a-button>
            </a-popover>
          </a-form-item>
          <a-form-item
                  :wrapper-col="buttonItemLayout.wrapperCol"
          >
            <a-dropdown :trigger="['click']">
              <a-button icon="down" type="primary">
                导出
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a-button type="primary" @click="handleExport(false)">
                    分包选择导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="1">
                  <a-button type="primary" @click="handleExport(true)">
                    分包全部导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="2">
                  <a-button type="primary" @click="handlePaidExport(false)">
                    分包付款发票选择导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="3">
                  <a-button type="primary" @click="handlePaidExport(true)">
                    分包付款发票全部导出
                  </a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-form-item>
        </a-form>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="columns" :dataSource="listTableData"
                     :pagination="listPaginationProps"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect: onSelect, onSelectAll: onSelectAll, onChange: onSelectChange}"
                     @change="handleTableChange" :scroll="{ x: 2400, y: 500}">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <div slot="outContractAmount" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="outPaid" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="outUnpaid" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <a-tag slot="outContractCategory" slot-scope="text" color="blue">
                {{text}}
              </a-tag>
              <a-tag slot="outProjectCategory" slot-scope="text" color="blue">
                {{text}}
              </a-tag>
              <span slot="receiptCash" slot-scope="text, record">
                <a @click="jumpToReceiptManager(record)">发票</a>
                <a-divider type="vertical"/>
                <a @click="jumpToPaidManager(record)">付款</a>
              </span>
              <template slot="selectIndex" slot-scope="text, record">
                <a-button type="primary" size="small" @click="openOutPaid(record)">
                  查看付款
                </a-button>
              </template>
            </a-table>
          </a-spin>
        </div>
      </div>
    </div>
    <a-modal
            title="分包付款详情"
            v-model="outPaidVisible"
            width="700px"
            :footer="null"
    >
      <a-spin :spinning="outPaidTableSpinning">
        <a-table bordered :columns="outPaidColumns" :dataSource="outPaidTableData"
                 :pagination="outPaidPaginationProps"
                 @change="handleOutPaidTableChange" :scroll="{ x: 600, y: 450}">
          <div slot="paidAmount" slot-scope="text" style="text-align: right">
            {{numToMoney(text)}}
          </div>
        </a-table>
      </a-spin>
    </a-modal>
    <a-drawer
            title="筛选条件"
            placement="right"
            :closable="false"
            @close="() => this.queryVisible = false"
            :visible="queryVisible"
            width="500"
    >
      <a-form formLayout="horizontal">
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="合同金额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="outContractAmountLowerBound"
                          @blur="onChange('outContractAmountLowerBound','outContractAmountUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="outContractAmountUpperBound"
                          @blur="onChange('outContractAmountLowerBound','outContractAmountUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="已付款金额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="outPaidLowerBound"
                          @blur="onChange('outPaidLowerBound','outPaidUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="outPaidUpperBound"
                          @blur="onChange('outPaidLowerBound','outPaidUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="未付款金额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="outUnpaidLowerBound"
                          @blur="onChange('outUnpaidLowerBound','outUnpaidUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="outUnpaidUpperBound"
                          @blur="onChange('outUnpaidLowerBound','outUnpaidUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="收款比例">
          <a-input-number :min="0" :max="100" v-model="ratioLowerBound"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"
                          @blur="onChange('ratioLowerBound','ratioUpperBound')"/>
          ~
          <a-input-number :min="0" :max="100" v-model="ratioUpperBound"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"
                          @blur="onChange('ratioLowerBound','ratioUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="日期范围"
        >
          <a-range-picker style="width: 220px;" v-model="queryDate"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="分包类型"
        >
          <a-select
                  :allowClear="true"
                  v-model="outContractCategoryId"
                  placeholder="请选择分包类型"
          >
            <template v-for="option in outContractCategoryList">
              <a-select-option :value="option.categoryId" :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="分包项目类型"
        >
          <a-select
                  :allowClear="true"
                  v-model="outProjectCategoryId"
                  placeholder="请选择分包项目类型"
          >
            <template v-for="option in outProjectCategoryList">
              <a-select-option :value="option.categoryId" :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <a-button type="primary" @click="handleQuery(false)">
            查找
          </a-button>
          <a-button style="margin-left: 16px" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";
  import moment from "moment";
  import numToMoney from "@utils/numToMoney";
  import {INFINITY} from "@/store/mutation-types";

  const formLayout = 'inline';
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
    name: "OutContractListPage",
    components: {
      HeaderPage,
    },
    data() {
      return {
        formLayout,
        numToMoney,
        buttonItemLayout,
        formItemLayout,
        formTailLayout,
        outContractId: '', // 模糊查询的外包合同号
        spinning: false, // table数据拉取加载
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
            sorter: (a, b) => (b.outContractId || '').localeCompare(a.outContractId || ''),
          }, {
            title: '分包合同名称',
            width: 160,
            key: 'outContractName',
            dataIndex: 'outContractName',
            sorter: (a, b) => (b.outContractName || '').localeCompare(a.outContractName || ''),
          }, {
            title: '合同号',
            width: 150,
            key: 'contractId',
            dataIndex: 'contractId',
            sorter: (a, b) => (b.contractId || '').localeCompare(a.contractId || ''),
          }, {
            title: '设计号',
            width: 150,
            key: 'designId',
            dataIndex: 'designId',
            sorter: (a, b) => (b.designId || '').localeCompare(a.designId || ''),
          }, {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
            sorter: (a, b) => (b.contractName || '').localeCompare(a.contractName || ''),
          }, {
            title: '分包合同金额(元)',
            width: 170,
            key: 'outContractAmount',
            dataIndex: 'outContractAmount',
            sorter: (a, b) => a.outContractAmount - b.outContractAmount,
            scopedSlots: {customRender: 'outContractAmount'}
          }, {
            title: '已付费金额(元)',
            width: 150,
            key: 'outPaid',
            dataIndex: 'outPaid',
            sorter: (a, b) => a.outPaid - b.outPaid,
            scopedSlots: {customRender: 'outPaid'}
          }, {
            title: '未付费金额(元)',
            width: 150,
            key: 'outUnpaid',
            dataIndex: 'outUnpaid',
            sorter: (a, b) => a.outUnpaid - b.outUnpaid,
            scopedSlots: {customRender: 'outUnpaid'}
          }, {
            title: '已付费比例',
            width: 150,
            key: 'ratio',
            dataIndex: 'ratio',
            sorter: (a, b) => a.ratio - b.ratio,
          }, {
            title: '实际归档日期',
            width: 200,
            key: 'outContractDate',
            dataIndex: 'outContractDate',
            sorter: (a, b) => new Date(a.outContractDate) - new Date(b.outContractDate),
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
            title: '发票付款',
            width: 120,
            key: 'receiptCash',
            dataIndex: 'receiptCash',
            scopedSlots: {customRender: 'receiptCash'},
          }, {
            title: '分包操作',
            width: 120,
            fixed: 'right',
            key: 'selectIndex',
            scopedSlots: {customRender: 'selectIndex'},
          }],
        outContractValue: '', // 被选择的分包合同号
        outPaidVisible: false, // 分包付款显示控制
        outPaidColumns: [
          {
            title: '付费时间',
            width: 200,
            key: 'paidDate',
            dataIndex: 'paidDate',
          },
          {
            title: '付费金额(元)',
            width: 200,
            key: 'paidAmount',
            dataIndex: 'paidAmount',
            scopedSlots: {customRender: 'paidAmount'}
          },
          {
            title: '备注',
            width: 200,
            key: 'paidNote',
            dataIndex: 'paidNote',
          }
        ], // 分包付款表头
        outPaidTableSpinning: false, // 分包付款信息加载控制
        popVisible: false,
        firstComing: 0,
        queryVisible: false,
        outContractAmountLowerBound: null,
        outContractAmountUpperBound: null,
        outPaidLowerBound: null,
        outPaidUpperBound: null,
        outUnpaidLowerBound: null,
        outUnpaidUpperBound: null,
        ratioLowerBound: null,
        ratioUpperBound: null,
        queryDate: [],
        outContractCategoryId: undefined,
        outProjectCategoryId: undefined,
        selectedRowKeys: [],
      }
    },
    computed: {
      ...mapState({
        role: state => state.tokensOperation.role, // 角色信息
        listTableData: state => state.outContractOperation.listTableData, // 选中的keys
        listPaginationProps: state => state.outContractOperation.listPaginationProps, // 分页控制
        outPaidTableData: state => state.outPaidOperation.tableData, // table数据
        outPaidPaginationProps: state => state.outPaidOperation.paginationProps,// 分页控制
        selectOutContractInfo: state => state.outContractOperation.selectOutContractInfo, // 被选择的分包合同
        outContractCategoryList: state => state.categoryOperation.outContractCategoryList,
        outProjectCategoryList: state => state.categoryOperation.outProjectCategoryList,
      }),
    },
    mounted() {
      this.updateTableData();
    },
    activated() {
      this.firstComing != 0 && this.updateTableData();
      this.firstComing++;
    },
    methods: {
      ...mapMutations({
        addOutContractInfo: 'outContractOperation/addOutContractInfo',
        removeOutContractInfo: 'outContractOperation/removeOutContractInfo', // 移除选中的合同
      }),
      ...mapActions({
        getOutContractListByIdLike: 'outContractOperation/getOutContractListByIdLike',
        getOutPaidsByOutContractId: 'outPaidOperation/getOutPaidsByOutContractId', // 获取分包付款信息
        exportOutContract: 'outContractOperation/exportOutContract', // 导出分包合同
        outPaidExport: 'outPaidOperation/outPaidExport', // 分包回款导出
      }),
      handleReset() {
        Object.assign(this, {
          outContractAmountLowerBound: null,
          outContractAmountUpperBound: null,
          outPaidLowerBound: null,
          outPaidUpperBound: null,
          outUnpaidLowerBound: null,
          outUnpaidUpperBound: null,
          ratioLowerBound: null,
          ratioUpperBound: null,
          queryDate: [],
          outContractCategoryId: undefined,
          outProjectCategoryId: undefined,
        })
      },
      // 查询处理
      handleQuery(isReset) {
        if (isReset) {
          this.handleReset();
        }
        this.listPaginationProps.current = 1;
        this.updateTableData();
      },
      // 导出处理
      handleExport(type) {
        let fileName = '分包导出列表.xlsx';
        if (this.selectOutContractInfo.length || type) {
          this.exportOutContract({
            outContractIds: this.selectOutContractInfo.map((item) => {return item.outContractId}),
            all: type,
          }).then((data) => {
            if (!data.data) {
              return
            }
            if ('msSaveOrOpenBlob' in navigator){ // IE下导出
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
        } else {
          this.$message.warning('您的选择列表为空！');
        }
      },
      // 分包付款发票导出
      handlePaidExport(type) {
        let fileName = '分包付款发票导出列表.xlsx';
        if (this.selectOutContractInfo.length || type) {
          this.outPaidExport({
            outContractIds: this.selectOutContractInfo.map((item) => {return item.outContractId}),
            all: type,
          }).then((data) => {
            if (!data.data) {
              return
            }
            if ('msSaveOrOpenBlob' in navigator){ // IE下导出
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
        } else {
         this.$message.warning('您的选择列表为空！');
        }
      },
      // 选择每页个数
      handleTableChange(pagination) {
        this.listPaginationProps.current = pagination.current;
        this.listPaginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      // 更新列表数据
      updateTableData() {
        this.spinning = true;
        let actualDate;
        if (this.queryDate.length) {
          actualDate = [moment(this.queryDate[0]).format('YYYY-MM-DD'), moment(this.queryDate[1]).format('YYYY-MM-DD')]
        } else {
          actualDate = ['', '']
        }
        const params = {
          outContractId: this.outContractId,
          actualDate: actualDate,
          outContractAmount: [this.outContractAmountLowerBound ? String(this.outContractAmountLowerBound) : '', this.outContractAmountUpperBound ? String(this.outContractAmountUpperBound) : ''],
          outPaid: [this.outPaidLowerBound ? String(this.outPaidLowerBound) : '', this.outPaidUpperBound ? String(this.outPaidUpperBound) : ''],
          outUnpaid: [this.outUnpaidLowerBound ? String(this.outUnpaidLowerBound) : '', this.outUnpaidUpperBound ? String(this.outUnpaidUpperBound) : ''],
          ratio: [this.ratioLowerBound ? String(this.ratioLowerBound/100) : '', this.ratioUpperBound ? String(this.ratioUpperBound/100) : ''],
          outContractCategoryId: this.outContractCategoryId,
          outProjectCategoryId: this.outProjectCategoryId,
          pageNum: this.listPaginationProps.current,
          pageLimit: this.listPaginationProps.pageSize === Infinity ? INFINITY : this.listPaginationProps.pageSize,
        };
        this.getOutContractListByIdLike(params).then((res) => {
          if (!res.data.meta.success) {
            this.$message.error(res.data.meta.message);
          }
          this.selectedRowKeys = [];
          this.listTableData.map((item, index) => {
            if (item.selectIndex) {
              this.selectedRowKeys.push(index);
            }
          });
          this.queryVisible = false;
          this.spinning = false;
        }).catch((error) => {
          this.spinning = false;
          this.$message.error(error);
        });
      },
      // 刷新分包付款
      updateOutPaidTableData() {
        this.outPaidTableSpinning = true;
        const params = {
          outContractId: this.outContractValue,
          pageNum: this.outPaidPaginationProps.current,
          pageLimit: this.outPaidPaginationProps.pageSize === Infinity ? INFINITY : this.outPaidPaginationProps.pageSize,
        };
        this.getOutPaidsByOutContractId(params).then((data) => {
          this.outPaidTableSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
          this.outPaidTableSpinning = false;
        });
      },
      // 查看分包付款
      openOutPaid(selectOutPaidData) {
        this.outContractValue = selectOutPaidData.outContractId;
        this.outPaidVisible = true;
        this.updateOutPaidTableData();
      },
      handleOutPaidTableChange(pagination) {
        this.outPaidPaginationProps.current = pagination.current;
        this.outPaidPaginationProps.pageSize = pagination.pageSize;
        this.updateOutPaidTableData();
      },
      // 处理分包合同选择
      handleSelected(rowData) {
        rowData.selectIndex = true;
        this.addOutContractInfo({
          outContractId: rowData.outContractId,
          outContractName: rowData.outContractName
        });
        this.popVisible = true;
      },
      // 处理合同移除
      handleRemoved(rowData) {
        rowData.selectIndex = false;
        this.removeOutContractInfo(rowData.outContractId);
        this.popVisible = true;
      },
      onSelect(record, selected, selectedRows) {
        if (record.selectIndex) {
          this.handleRemoved(record);
        } else {
          this.handleSelected(record);
        }
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      onSelectAll(selected, selectedRows, changeRows) {
        changeRows.map(item => {
          if (item.selectIndex) {
            this.handleRemoved(item);
          } else {
            this.handleSelected(item);
          }
        });
      },
      handleAccurateQuery() {
        this.queryVisible = true;
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
          path: '/main/outcontractreceipt',
          query: {outContractId: data.outContractId}
        })
      },
      jumpToPaidManager(data) {
        this.$router.push({
          path: '/main/outcontractpaid',
          query: {outContractId: data.outContractId}
        })
      }
    }
  }
</script>