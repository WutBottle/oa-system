<style lang="scss" scoped>
  .ProjectExportPage {
    .page-content {
      padding: 24px;

      .form-wrapper {
        margin-bottom: 18px;
      }
    }

    .tr {
      text-align: right;
    }
  }
</style>

<template>
  <div class="ProjectExportPage">
    <HeaderPage title="项目导出"/>
    <div class="page-content">
      <div style="background-color: #fff;padding: 24px">
        <a-form class="form-wrapper" :layout="formLayout">
          <a-form-item>
            <a-button type="primary" icon="search" @click="() => this.queryVisible=true">精确查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-popover title="项目选择列表" placement="bottom" trigger="click" v-model="popVisible">
              <template slot="content">
                <div v-if="!!selectProjectInfo.length" style="width: 350px">
                  <template v-for="(item, index) in selectProjectInfo">
                    <div :key="index">
                      <span>{{index + 1}}</span>
                      <a-divider type="vertical"/>
                      <span>{{item.contractId}}</span>
                      <a-divider type="vertical"/>
                      <span>{{item.contractName}}</span>
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
          <a-form-item>
            <a-dropdown :trigger="['click']">
              <a-button icon="down" type="primary">
                导出
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a-button type="primary" @click="handleExport(false)">
                    选择导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="1">
                  <a-button type="primary" @click="handleExport(true)">
                    全部导出
                  </a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-form-item>
          <a-form-item>
            <a-popover title="项目导出表头配置" placement="bottom" trigger="click" v-model="settingVisible">
              <template slot="content">
                <div style="width: 480px">
                  <a-checkbox-group v-model="selectOptions" @change="onTableHeaderChange">
                    <a-row>
                      <a-col :span="8" v-for="(item, index) in options" :key="index">
                        <a-checkbox :value="item">{{item}}</a-checkbox>
                      </a-col>
                    </a-row>
                  </a-checkbox-group>
                </div>
              </template>
              <a-button type="primary" shape="circle" icon="setting"></a-button>
            </a-popover>
          </a-form-item>
        </a-form>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="columns" :dataSource="tableData"
                     :pagination="paginationProps"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect: onSelect, onSelectAll: onSelectAll, onChange: onSelectChange}"
                     @change="handleTableChange" :scroll="{ x: 2160, y: 550}">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <div slot="scale" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="ratio" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="receiptAmount" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="receiptNotCash" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="receiptRemain" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="projectAmount" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="cashAmount" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="contractRemain" slot-scope="text" class="tr">
                {{numToMoney(text)}}
              </div>
              <div slot="projectInvestment" slot-scope="text" class="tr">
                {{numToMoney(text / 10000)}}
              </div>
              <span slot="isSign" slot-scope="text">
                <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
              </span>
              <a-progress slot="ratio" slot-scope="text" type="circle" :percent="text" :width="60"/>
            </a-table>
          </a-spin>
        </div>
      </div>
    </div>
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
                label="合同号"
        >
          <a-input placeholder="请输入合同号" v-model="queryContractId" style="width: 120px"></a-input>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="签约状态"
        >
          <a-select
                  :allowClear="true"
                  v-model="isSign"
                  placeholder="请选择发票类型"
          >
            <a-select-option :value="0">
              已签
            </a-select-option>
            <a-select-option :value="1">
              洽谈
            </a-select-option>
            <a-select-option :value="2">
              投标
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="规模范围"
        >
          <a-input-number :min="0" :max="Infinity" v-model="scaleLowerBound"
                          @blur="onChange('scaleLowerBound','scaleUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="scaleUpperBound"
                          @blur="onChange('scaleLowerBound','scaleUpperBound')"/>
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
                label="累开发票金额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="receiptAmountLowerBound"
                          @blur="onChange('receiptAmountLowerBound','receiptAmountUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="receiptAmountUpperBound"
                          @blur="onChange('receiptAmountLowerBound','receiptAmountUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目总额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="totalLowerBound"
                          @blur="onChange('totalLowerBound','totalUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="totalUpperBound"
                          @blur="onChange('totalLowerBound','totalUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="累计现金回款"
        >
          <a-input-number :min="0" :max="Infinity" v-model="cashAmountLowerBound"
                          @blur="onChange('cashAmountLowerBound','cashAmountUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="cashAmountUpperBound"
                          @blur="onChange('cashAmountLowerBound','cashAmountUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="剩余合同额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="contractRemainLowerBound"
                          @blur="onChange('contractRemainLowerBound','contractRemainUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="contractRemainUpperBound"
                          @blur="onChange('contractRemainLowerBound','contractRemainUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目投资总额"
        >
          <a-input-number :min="0" :max="Infinity" v-model="projectInvestmentLowerBound"
                          @blur="onChange('projectInvestmentLowerBound','projectInvestmentUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="projectInvestmentUpperBound"
                          @blur="onChange('projectInvestmentLowerBound','projectInvestmentUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="时间范围"
        >
          <a-range-picker style="width: 220px;" v-model="queryDate"/>
        </a-form-item>
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <a-button type="primary" @click="handleQuery">
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
  import {mapActions} from 'vuex'
  import moment from 'moment';
  import HeaderPage from "../HeaderPage/HeaderPage";
  import numToMoney from "@utils/numToMoney";
  import {INFINITY} from "@/store/mutation-types";

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  const statusMap = {
    0: {
      status: 'success',
      text: '已签'
    },
    1: {
      status: 'processing',
      text: '洽谈'
    },
    2: {
      status: 'error',
      text: '投标'
    },
    3: {
      status: 'error',
      text: '待定'
    },
  };

  export default {
    name: "ProjectExportPage",
    components: {
      HeaderPage,
    },
    data() {
      return {
        formLayout: 'inline',
        numToMoney,
        formItemLayout,
        formTailLayout,
        queryVisible: false,
        queryContractId: undefined,
        queryDate: [],
        isSign: undefined,
        scaleUpperBound: null,
        scaleLowerBound: null,
        totalLowerBound: null,
        totalUpperBound: null,
        ratioLowerBound: null,
        ratioUpperBound: null,
        receiptAmountLowerBound: null,
        receiptAmountUpperBound: null,
        cashAmountLowerBound: null,
        cashAmountUpperBound: null,
        contractRemainLowerBound: null,
        contractRemainUpperBound: null,
        projectInvestmentLowerBound: null,
        projectInvestmentUpperBound: null,
        popVisible: false,
        selectProjectInfo: [],
        settingVisible: false,
        selectOptions: ['签约状态', '设计号', '合同号', '发包人合同编号', '合同名称', '生产阶段', '合同额(元)', '累计现金回款(元)',
          '剩余合同额(元)', '已收款比例', '累计开票金额(元)', '已开发票未收款金额', '实际签约日期', '合同归档日期',
          '项目类别', '主设计部门', '经营部门', '项目经理', '商务专员', '财务专员', '项目经营负责人', '部门经营负责人', '发包方', '投资额(万元)', '项目规模(平方米)',
          '地上面积(平方米)', '地下面积(平方米)', '地域', '地区关键词', '建筑一级分类', '建筑二级分类', '是否EPC项目'],
        options: ['签约状态', '设计号', '合同号', '发包人合同编号', '合同名称', '生产阶段', '合同额(元)', '累计现金回款(元)',
          '剩余合同额(元)', '已收款比例', '累计开票金额(元)', '已开发票未收款金额', '实际签约日期', '合同归档日期',
          '项目类别', '主设计部门', '经营部门', '项目经理', '商务专员', '财务专员', '项目经营负责人', '部门经营负责人', '发包方', '投资额(万元)', '项目规模(平方米)',
          '地上面积(平方米)', '地下面积(平方米)', '地域', '地区关键词', '建筑一级分类', '建筑二级分类', '是否EPC项目'],
        spinning: false,
        tableData: [],
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40', 'Infinity'], // 每页数量选项
          total: 0,
          current: 1,
        },
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
            title: '合同号',
            width: 120,
            fixed: 'left',
            key: 'contractId',
            dataIndex: 'contractId',
            sorter: (a, b) => (b.contractId || '').localeCompare(a.contractId || ''),
          },
          {
            title: '合同名称',
            width: 150,
            key: 'contractName',
            dataIndex: 'contractName',
            sorter: (a, b) => (b.contractName || '').localeCompare(a.contractName || ''),
          },
          {
            title: '设计号',
            width: 150,
            key: 'designId',
            dataIndex: 'designId',
            sorter: (a, b) => (b.designId || '').localeCompare(a.designId || ''),
          },
          {
            title: '签约状态',
            width: 150,
            key: 'isSign',
            dataIndex: 'isSign',
            scopedSlots: {customRender: 'isSign'}
          },
          {
            title: '项目规模(平方米)',
            width: 170,
            key: 'scale',
            dataIndex: 'scale',
            sorter: (a, b) => a.scale - b.scale,
            scopedSlots: {customRender: 'scale'}
          },
          {
            title: '收款比例',
            width: 120,
            key: 'ratio',
            dataIndex: 'ratio',
            scopedSlots: {customRender: 'ratio'},
            sorter: (a, b) => a.ratio - b.ratio,
          },
          {
            title: '累计开票金额(元)',
            width: 170,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
            sorter: (a, b) => a.receiptAmount - b.receiptAmount,
            scopedSlots: {customRender: 'receiptAmount'}
          },
          {
            title: '已开发票未收款金额(元)',
            width: 210,
            key: 'receiptNotCash',
            dataIndex: 'receiptNotCash',
            sorter: (a, b) => a.receiptNotCash - b.receiptNotCash,
            scopedSlots: {customRender: 'receiptNotCash'}
          },
          {
            title: '剩余发票额(元)',
            width: 150,
            key: 'receiptRemain',
            dataIndex: 'receiptRemain',
            sorter: (a, b) => a.receiptRemain - b.receiptRemain,
            scopedSlots: {customRender: 'receiptRemain'}

          },
          {
            title: '项目总金额(元)',
            width: 150,
            key: 'projectAmount',
            dataIndex: 'projectAmount',
            sorter: (a, b) => a.projectAmount - b.projectAmount,
            scopedSlots: {customRender: 'projectAmount'}
          },
          {
            title: '累计现金回款(元)',
            width: 170,
            key: 'cashAmount',
            dataIndex: 'cashAmount',
            sorter: (a, b) => a.cashAmount - b.cashAmount,
            scopedSlots: {customRender: 'cashAmount'}
          },
          {
            title: '剩余合同额(元)',
            width: 150,
            key: 'contractRemain',
            dataIndex: 'contractRemain',
            sorter: (a, b) => a.contractRemain - b.contractRemain,
            scopedSlots: {customRender: 'contractRemain'}
          },
          {
            title: '项目总投资额(万元)',
            width: 180,
            key: 'projectInvestment',
            dataIndex: 'projectInvestment',
            sorter: (a, b) => a.projectInvestment - b.projectInvestment,
            scopedSlots: {customRender: 'projectInvestment'}
          },
        ],
        selectedRowKeys: [],
      }
    },
    filters: {
      statusFilter(type) {
        if (type >= 0){
          return statusMap[type].text
        } else {
          return statusMap[3].text
        }
      },
      statusTypeFilter(type) {
        if (type >= 0){
          return statusMap[type].status
        } else {
          return statusMap[3].status
        }
      }
    },
    mounted() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        getProjectListAfterFilter: 'contractList/getProjectListAfterFilter',
        exportContract: 'contractList/exportContract',
      }),
      onChange(lowerBound, upperBound) {
        if (this[lowerBound] && this[upperBound] && this[upperBound] < this[lowerBound]) {
          let temp = this[lowerBound];
          this[lowerBound] = this[upperBound];
          this[upperBound] = temp;
        }
      },
      // 项目导出
      handleExport(type) {
        let fileName = '项目.xlsx';
        if (this.selectProjectInfo.length || type) {
          this.exportContract({
            contractIds: this.selectProjectInfo.map((item) => {
              return item.contractId
            }),
            header: this.selectOptions,
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
      // 处理表头选择
      onTableHeaderChange(checkedValues) {
        this.selectOptions = checkedValues
      },
      updateTableData() {
        this.spinning = true;
        let contractId, actualDate;
        if (this.queryContractId) {
          contractId = this.queryContractId
        } else {
          contractId = '';
        }
        if (this.queryDate.length) {
          actualDate = [moment(this.queryDate[0]).format('YYYY-MM-DD'), moment(this.queryDate[1]).format('YYYY-MM-DD')]
        } else {
          actualDate = ['', '']
        }
        const params = {
          contractId: contractId,
          actualDate: actualDate,
          isSign: this.isSign,
          cashAmount: [this.cashAmountLowerBound ? String(this.cashAmountLowerBound) : '', this.cashAmountUpperBound ? String(this.cashAmountUpperBound) : ''],
          contractRemain: [this.contractRemainLowerBound ? String(this.contractRemainLowerBound) : '', this.contractRemainUpperBound ? String(this.contractRemainUpperBound) : ''],
          projectInvestment: [this.projectInvestmentLowerBound ? String(this.projectInvestmentLowerBound) : '', this.projectInvestmentUpperBound ? String(this.projectInvestmentUpperBound) : ''],
          receiptAmount: [this.receiptAmountLowerBound ? String(this.receiptAmountLowerBound) : '', this.receiptAmountUpperBound ? String(this.receiptAmountUpperBound) : ''],
          projectAmount: [this.totalLowerBound ? String(this.totalLowerBound) : '', this.totalUpperBound ? String(this.totalUpperBound) : ''],
          ratio: [this.ratioLowerBound ? String(this.ratioLowerBound/100) : '', this.ratioUpperBound ? String(this.ratioUpperBound/100) : ''],
          scale: [this.scaleLowerBound ? String(this.scaleLowerBound) : '', this.scaleUpperBound ? String(this.scaleUpperBound) : ''],
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize === Infinity ? INFINITY : this.paginationProps.pageSize,
        };
        this.getProjectListAfterFilter(params).then(data => {
          if (data.data.meta.success) {
            this.paginationProps.total = data.data.data.totalElements;
            this.tableData = data.data.data.content.map((item, index) => {
              return {
                key: index,
                receiptAmount: item.receiptAmount,
                receiptNotCash: item.receiptNotCash,
                receiptRemain: item.receiptRemain,
                projectAmount: item.projectAmount,
                contractId: item.contractId,
                cashAmount: item.cashAmount,
                designId: item.designId,
                contractName: item.contractName,
                contractRemain: item.contractRemain,
                projectInvestment: item.projectInvestment,
                isSign: item.isSign,
                scale: item.scale,
                ratio: !isNaN(item.ratio) && Number((item.ratio * 100).toFixed(4)),
                selectIndex: !!this.selectProjectInfo.find(value => value.contractId === item.contractId),
              }
            });
            this.selectedRowKeys = [];
            this.tableData.map((item, index) => {
              if (item.selectIndex) {
                this.selectedRowKeys.push(index);
              }
            });
            this.spinning = false;
          } else {
            this.$message.error(data.data.meta.message);
            this.spinning = false;
          }
        }).catch((error) => {
          this.spinning = false;
        });
      },
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      handleQuery() {
        this.paginationProps.current = 1;
        this.updateTableData();
      },
      removeProjectInfo(id) {
        this.selectProjectInfo.splice(this.selectProjectInfo.findIndex(item => item.contractId === id), 1);
      },
      // 处理项目移除
      handleRemoved(rowData) {
        rowData.selectIndex = false;
        this.removeProjectInfo(rowData.contractId);
        this.popVisible = true;
      },
      // 处理项目选择
      handleSelected(rowData) {
        rowData.selectIndex = true;
        this.selectProjectInfo.push({
          contractId: rowData.contractId,
          contractName: rowData.contractName
        });
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
      handleReset() {
        Object.assign(this, {
          queryContractId: undefined,
          queryDate: [],
          isSign: undefined,
          scaleUpperBound: null,
          scaleLowerBound: null,
          totalLowerBound: null,
          totalUpperBound: null,
          ratioLowerBound: null,
          ratioUpperBound: null,
          receiptAmountLowerBound: null,
          receiptAmountUpperBound: null,
          receiptRemainLowerBound: null,
          receiptRemainUpperBound: null,
          cashAmountLowerBound: null,
          cashAmountUpperBound: null,
          contractRemainLowerBound: null,
          contractRemainUpperBound: null,
          projectInvestmentLowerBound: null,
          projectInvestmentUpperBound: null,
        })
      }
    }
  }
</script>