<style lang="scss" scoped>
  .ProjectExportPage {
    .page-content {
      padding: 24px;

      .form-wrapper {
        margin-bottom: 18px;
      }
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
                  <a-button type="primary" @click="handleExport">
                    项目导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="1">
                  <a-button type="primary" @click="handleCashReceiptExport">
                    项目现金发票导出
                  </a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-form-item>
          <a-form-item>
            <a-popover title="表单配置" placement="bottom" trigger="click" v-model="settingVisible">
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
                     @change="handleTableChange" :scroll="{ x: 2070, y: 550}">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
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
            @close="onClose"
            :visible="queryVisible"
            width="400"
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
                label="年份范围"
        >
          <a-range-picker style="width: 220px;" @change="onDataChange"/>
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
                label="总额范围"
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
                label="比例范围">
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
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <a-button type="primary" @click="handleQuery">
            查找
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
  };

  export default {
    name: "ProjectExportPage",
    components: {
      HeaderPage,
    },
    data() {
      return {
        formLayout: 'inline',
        formItemLayout,
        formTailLayout,
        queryVisible: false,
        queryContractId: undefined,
        queryDate: [],
        scaleUpperBound: null,
        scaleLowerBound: null,
        totalLowerBound: null,
        totalUpperBound: null,
        ratioLowerBound: null,
        ratioUpperBound: null,
        popVisible: false,
        selectProjectInfo: [],
        settingVisible: false,
        selectOptions: ['合同号', '合同名称', '设计号', '签约状态', '项目规模(平方米)', '已收款比例', '投资额(万元)'],
        options: ['签约状态', '设计号', '合同号', '发包人合同编号', '合同名称', '生产阶段', '合同额(元)', '累计现金回款(元)',
          '剩余合同额(元)', '已收款比例', '累计开票金额(元)', '已开发票未收款金额', '实际签约日期', '合同归档日期',
          '项目类别', '主设计部门', '经营部门', '项目经理', '行政专员', '经营负责人', '总监', '发包方', '投资额(万元)', '项目规模(平方米)',
          '地域', '地区关键词', '建筑一级分类', '建筑二级分类', '是否EPC项目'],
        spinning: false,
        tableData: [],
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20'], // 每页数量选项
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
          },
          {
            title: '合同名称',
            width: 150,
            key: 'contractName',
            dataIndex: 'contractName',
          },
          {
            title: '设计号',
            width: 150,
            key: 'designId',
            dataIndex: 'designId',
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
            width: 150,
            key: 'scale',
            dataIndex: 'scale',
          },
          {
            title: '收款比例',
            width: 100,
            key: 'ratio',
            dataIndex: 'ratio',
            scopedSlots: {customRender: 'ratio'}
          },
          {
            title: '累计开票金额(元)',
            width: 150,
            key: 'receiptAmount',
            dataIndex: 'receiptAmount',
          },
          {
            title: '已开发票未收款金额(元)',
            width: 210,
            key: 'receiptNotCash',
            dataIndex: 'receiptNotCash',
          },
          {
            title: '剩余发票额(元)',
            width: 150,
            key: 'receiptRemain',
            dataIndex: 'receiptRemain',
          },
          {
            title: '项目总金额(元)',
            width: 150,
            key: 'projectAmount',
            dataIndex: 'projectAmount',
          },
          {
            title: '累计现金回款(元)',
            width: 150,
            key: 'cashAmount',
            dataIndex: 'cashAmount',
          },
          {
            title: '剩余合同额(元)',
            width: 150,
            key: 'contractRemain',
            dataIndex: 'contractRemain',
          },
          {
            title: '项目总投资额(元)',
            width: 150,
            key: 'projectInvestment',
            dataIndex: 'projectInvestment',
          },
        ],
        selectedRowKeys: [],
      }
    },
    filters: {
      statusFilter(type) {
        return statusMap[type].text
      },
      statusTypeFilter(type) {
        return statusMap[type].status
      }
    },
    mounted() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        getProjectListAfterFilter: 'contractList/getProjectListAfterFilter',
        exportContract: 'contractList/exportContract',
        cashExport: 'cashOperation/cashExport'
      }),
      onDataChange(date) {
        this.queryDate = date;
      },
      onChange(lowerBound, upperBound) {
        if (this[lowerBound] && this[upperBound] && this[upperBound] < this[lowerBound]) {
          let temp = this[lowerBound];
          this[lowerBound] = this[upperBound];
          this[upperBound] = temp;
        }
      },
      // 项目导出
      handleExport() {
        let fileName = '项目.xlsx';
        this.exportContract({
          contractIds: this.selectProjectInfo.map((item) => {return item.contractId}),
          header: this.selectOptions,
        }).then((data) => {
          if (!data.data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          this.$message.success("导出成功");
        }).catch((error) => {
          this.$message.error("导出失败");
        });
      },
      // 项目现金发票导出
      handleCashReceiptExport() {
        let fileName = '项目现金发票.xlsx';
        this.cashExport({
          contractIds: this.selectProjectInfo.map((item) => {return item.contractId}),
        }).then((data) => {
          if (!data.data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          this.$message.success("导出成功");
        }).catch((error) => {
          this.$message.error("导出失败");
        });
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
          projectAmount: [this.totalLowerBound ? String(this.totalLowerBound) : '', this.totalUpperBound ? String(this.totalUpperBound) : ''],
          ratio: [this.ratioLowerBound ? String(this.ratioLowerBound/100) : '', this.ratioUpperBound ? String(this.ratioUpperBound/100) : ''],
          scale: [this.scaleLowerBound ? String(this.scaleLowerBound) : '', this.scaleUpperBound ? String(this.scaleUpperBound) : ''],
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
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
                ratio: item.ratio && Number((item.ratio * 100).toFixed(4)),
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
      onClose() {
        this.queryVisible = false;
      },
      handleQuery() {
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
    }
  }
</script>