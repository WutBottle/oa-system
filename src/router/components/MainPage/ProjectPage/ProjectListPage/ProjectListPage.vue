<style lang="scss" scoped>
  .ProjectListPage {
    .form-wrapper {
      margin-bottom: 18px;
    }
  }
</style>

<template>
  <div class="ProjectListPage">
    <a-form class="form-wrapper" :layout="formLayout">
      <a-form-item
              label="项目合同号"
      >
        <a-input style="width: 140px" v-model="contractId" placeholder="请输入合同号"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleQuery">
          查询
        </a-button>
      </a-form-item>
    </a-form>
    <div class="table-wrapper">
      <a-spin :spinning="spinning" tip="Loading...">
        <a-table bordered :columns="columns" :dataSource="tableData"
                 :pagination="paginationProps"
                 @change="handleTableChange" :scroll="{ x: 2080, y: 550}">
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="isSign" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
          </span>
          <template slot="operation" slot-scope="text, record">
            <a-button type="danger" size="small" @click="handleOpen(record)">
              查看
            </a-button>
            <a-divider type="vertical"/>
            <a-dropdown :trigger="['click']">
              <a-button icon="down" type="primary">
                导出
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a-button type="primary" @click="handleExport(record)">
                    合同导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="1">
                  <a-button type="primary" @click="handleCashExport(record)">
                    现金发票
                  </a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'

  const statusMap = {
    true: {
      status: 'success',
      text: '已签约'
    },
    false: {
      status: 'error',
      text: '未签约'
    }
  };
  export default {
    name: "ProjectListPage",
    data() {
      return {
        formLayout: 'inline',
        contractId: '',
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
          {
            title: '已收款比例',
            width: 150,
            key: 'ratio',
            dataIndex: 'ratio',
          },
          {
            width: 180,
            title: '合同操作',
            fixed: 'right',
            key: 'operation',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
          },
        ],
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
    activated() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        getProjectListByIdLike: 'contractList/getProjectListByIdLike',
        exportContract: 'contractList/exportContract',
        cashExport: 'cashOperation/cashExport'
      }),
      updateTableData() {
        this.spinning = true;
        const params = {
          contractId: this.contractId,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
        };
        this.getProjectListByIdLike(params).then((data) => {
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
                ratio: item.ratio && item.ratio.toFixed(4)
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
      handleQuery() {
        this.updateTableData();
      },
      handleOpen(selectData) {
        this.$emit('handleContractOpen', selectData.contractId)
      },
      handleExport(selectData) {
        let fileName = '项目' + selectData.contractId + '.xlsx';
        this.exportContract({
          contractIds: [selectData.contractId],
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
      handleCashExport(selectData) {
        let fileName = '现金发票' + selectData.contractId + '.xlsx';
        this.cashExport({
          contractIds: [selectData.contractId],
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
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
    }
  }
</script>