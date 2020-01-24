<style lang="scss" scoped>
  .ListPage {
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

      .content-wrapper {
        position: relative;
        overflow: hidden;
        padding: 24px 32px;
        background-color: #fff;

        .form-wrapper {
          margin-bottom: 18px;
        }

        .info-wrapper {
          margin-bottom: 16px;

          a {
            font-weight: 600;
          }
        }

        .table-wrapper {
        }
      }
    }
  }
</style>

<template>
  <div class="ListPage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>合同列表</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">合同列表</p>
    </div>
    <div class="page-content">
      <div class="content-wrapper">
        <a-form class="form-wrapper" :layout="formLayout">
          <a-form-item
                  label="合同号"
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input v-model="contractId" placeholder="请输入合同名称"/>
          </a-form-item>
          <a-form-item
                  :wrapper-col="buttonItemLayout.wrapperCol"
          >
            <a-button type="primary" @click="handleQuery">
              查询
            </a-button>
          </a-form-item>
          <a-form-item
                  :wrapper-col="buttonItemLayout.wrapperCol"
          >
            <a-button :disabled="!this.selectedRowKeys.length" type="primary" @click="handleExport">
              导出
            </a-button>
          </a-form-item>
        </a-form>
        <div class="info-wrapper">
          <a-alert :message="messageContent" type="info" showIcon/>
        </div>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="columns" :dataSource="tableData"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                     :pagination="paginationProps"
                     @change="handleTableChange" :scroll="{ x: 'max-content'}">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="signState" slot-scope="text">
                <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
              </span>
              <span slot="itemCategory" slot-scope="tags">
                <a-tag v-for="tag in tags" color="blue"
                       :key="tag.projectCategoryName">{{tag.projectCategoryName}}</a-tag>
              </span>
              <span slot="epc" slot-scope="text">
                <a-icon :style="{color: text ? 'green' : 'red'}" :type="text ? 'check' : 'close'"/>
              </span>
              <span slot="contractFile" slot-scope="text">
                <a-button type="primary" icon="download" :loading="text.isDownload" @click="handleFileDownload(text)">
                  下载文件
                </a-button>
              </span>
            </a-table>
          </a-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    name: "ListPage",
    data() {
      return {
        formLayout: 'inline',
        formItemLayout: {
          labelCol: {span: 5},
          wrapperCol: {span: 16}
        },
        buttonItemLayout: {
          wrapperCol: {span: 14, offset: 0}
        },
        spinning: false,
        contractId: '', // 模糊查询的合同id
        contractIds: [], // 导出合同id
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
            width: 100,
            fixed: 'left',
            key: 'contractNum',
            dataIndex: 'contractNum',
          },
          {
            title: '签约状态',
            width: 100,
            fixed: 'left',
            dataIndex: 'signState',
            key: 'signState',
            scopedSlots: {customRender: 'signState'}
          },
          {
            title: '设计号',
            width: 120,
            key: 'designNum',
            dataIndex: 'designNum',
          },
          {
            title: '发包人合同编号',
            width: 150,
            key: 'employerContractNum',
            dataIndex: 'employerContractNum',
          },
          {
            title: '合同名称',
            width: 150,
            key: 'contractName',
            dataIndex: 'contractName',
          },
          {
            title: '合同节点',
            width: 100,
            key: 'contractNode',
            dataIndex: 'contractNode',
          },
          {
            title: '合同额(元)',
            width: 100,
            key: 'contractAmount',
            dataIndex: 'contractAmount',
          },
          {
            title: '累计现金回款(元)',
            width: 150,
            key: 'accumulatedCashReceipts',
            dataIndex: 'accumulatedCashReceipts',
          },
          {
            title: '剩余合同额(元)',
            width: 150,
            key: 'remainingContractAmount',
            dataIndex: 'remainingContractAmount',
          },
          {
            title: '已收款比例',
            width: 110,
            key: 'receivedProportion',
            dataIndex: 'receivedProportion',
          },
          {
            title: '累计开票金额(元)',
            width: 150,
            key: 'cumulativeInvoicedAmount',
            dataIndex: 'cumulativeInvoicedAmount',
          },
          {
            title: '已开发票未收款金额',
            width: 150,
            key: 'invoicedUncollectedAmount',
            dataIndex: 'invoicedUncollectedAmount',
          },
          {
            title: '实际签约日期',
            width: 150,
            key: 'actualSigningDate',
            dataIndex: 'actualSigningDate',
          },
          {
            title: '合同归档日期',
            width: 150,
            key: 'contractFilingDate',
            dataIndex: 'contractFilingDate',
          },
          {
            title: '项目类别',
            width: 150,
            key: 'itemCategory',
            dataIndex: 'itemCategory',
            scopedSlots: {customRender: 'itemCategory'}
          },
          {
            title: '主设计部门',
            width: 150,
            key: 'mainDesignDepartment',
            dataIndex: 'mainDesignDepartment',
          },
          {
            title: '经营部门',
            width: 150,
            key: 'managementDepartment',
            dataIndex: 'managementDepartment',
          },
          {
            title: '项目经理',
            width: 150,
            key: 'projectManager',
            dataIndex: 'projectManager',
          },
          {
            title: '项目预算秘书',
            width: 150,
            key: 'projectSecretary',
            dataIndex: 'projectSecretary',
          },
          {
            title: '发包方',
            width: 150,
            key: 'contractingParty',
            dataIndex: 'contractingParty',
          },
          {
            title: '投资额(万元)',
            width: 150,
            key: 'investmentAmount',
            dataIndex: 'investmentAmount',
          },
          {
            title: '项目规模(平方米)',
            width: 150,
            key: 'projectScale',
            dataIndex: 'projectScale',
          },
          {
            title: '地域',
            width: 150,
            key: 'region',
            dataIndex: 'region',
          },
          {
            title: '地区关键词',
            width: 150,
            key: 'regionalKeyWords',
            dataIndex: 'regionalKeyWords',
          },
          {
            title: '建筑一级分类',
            width: 120,
            key: 'class1',
            dataIndex: 'class1',
          },
          {
            title: '建筑二级分类',
            width: 120,
            key: 'class2',
            dataIndex: 'class2',
          },
          {
            title: '是否EPC项目',
            width: 120,
            key: 'epc',
            dataIndex: 'epc',
            scopedSlots: {customRender: 'epc'}
          },
          {
            fixed: 'right',
            width: 150,
            title: '合同扫描文件',
            key: 'contractFile',
            dataIndex: 'contractFile',
            scopedSlots: {customRender: 'contractFile'}
          },
        ],
      }
    },
    computed: {
      ...mapState({
        countNum: state => state.contractList.countNum,// 选择合同数
        totalMoney: state => state.contractList.totalMoney, // 合同总金额
        paginationProps: state => state.contractList.paginationProps, // 分页选项
        tableData: state => state.contractList.tableData, // 合同数据
        selectedRowKeys: state => state.contractList.selectedRowKeys, //选中的keys
      }),
      messageContent() {
        return <span>已选择:<a>{this.countNum}< /a>&nbsp;&nbsp;合同金额总计<a>{this.totalMoney}元</a></span>;
      },
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
      this.spinning = true;
      const params = {
        contractId: this.contractId,
        pageNum: this.paginationProps.current,
        pageLimit: this.paginationProps.pageSize
      };
      this.getContractListById(params).then((data) => {
        if (data.data.meta.success) {
          this.spinning = false;
        } else {
          this.$message.error(data.data.meta.message);
        }
      }).catch((error) => {
        this.spinning = false;
      });
    },
    methods: {
      ...mapMutations({
        setSelectedRowKeys: 'contractList/setSelectedRowKeys', // 设置选中的keys
      }),
      ...mapActions({
        downloadContract: 'contractList/downloadContract',
        getContractListById: 'contractList/getContractListById',
        exportContract: 'contractList/exportContract',
      }),
      handleQuery() {
        this.paginationProps.current = 1;
        this.spinning = true;
        const params = {
          contractId: this.contractId,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
        };
        this.getContractListById(params).then((data) => {
          if (data.data.meta.success) {
            this.spinning = false;
          } else {
            this.$message.error(data.data.meta.message);
          }
        }).catch((error) => {
          this.spinning = false;
        });
      },
      handleFileDownload(contractFile) {
        contractFile.isDownload = true;
        this.downloadContract({
          contractId: contractFile.contractId,
        }).then((data) => {
          console.log(data);
          if (!data.data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', contractFile.contractId + '.pdf');
          document.body.appendChild(link);
          link.click();
          contractFile.isDownload = false;
          this.$message.success("下载成功");
        }).catch((error) => {
          contractFile.isDownload = false;
        });
      },
      handleTableChange(pagination) {
        this.spinning = true;
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        const params = {
          contractId: this.contractId,
          pageNum: pagination.current,
          pageLimit: pagination.pageSize
        };
        this.getContractListById(params).then((data) => {
          if (data.data.meta.success) {
            this.spinning = false;
          } else {
            this.$message.error(data.data.meta.message);
          }
        }).catch((error) => {
          console.log(error);
          this.spinning = false;
        });
      },
      handleExport() {
        this.exportContract({
          contractIds: this.contractIds
        }).then((data) => {
          if (!data.data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', 'export.xls');
          document.body.appendChild(link);
          link.click();
          this.$message.success("导出成功");
        }).catch((error) => {
          console.log(error);
        });
      },
      onSelectChange(selectedRowKeys) {
        this.contractIds = [];
        selectedRowKeys.forEach((item) => {
          this.contractIds.push(this.tableData[item].contractNum)
        });
        this.setSelectedRowKeys(selectedRowKeys);
      }
    }
  }
</script>