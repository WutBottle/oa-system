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
      <div class="title">合同列表</div>
    </div>
    <div class="page-content">
      <div class="content-wrapper">
        <a-form class="form-wrapper" :layout="formLayout">
          <a-form-item
                  label="合同号"
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input v-model="contractId" placeholder="请输入合同号"/>
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
            <a-dropdown :trigger="['click']">
              <a-button icon="down" type="primary">
                导出
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a-button type="primary" @click="handleExport">
                    合同导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="1">
                  <a-button type="primary" @click="handleCashExport">
                    现金发票
                  </a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-form-item>
          <a-form-item
                  :wrapper-col="buttonItemLayout.wrapperCol"
          >
            <a-popover title="合同选择列表" placement="bottom" trigger="click" v-model="popVisible">
              <template slot="content">
                <div v-if="!!selectContractInfo.length" style="width: 350px">
                  <template v-for="(item, index) in selectContractInfo">
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
          <a-form-item
                  v-if="this.role === 'ROLE_ADMIN'"
                  :wrapper-col="buttonItemLayout.wrapperCol"
          >
            <a-popconfirm title="确定删除?" @confirm="handleDelete" @cancel="cancelDelete" okText="确定" cancelText="取消">
              <a-icon slot="icon" type="question-circle-o" style="color: red" />
              <a-button type="danger">
                批量删除
              </a-button>
            </a-popconfirm>
          </a-form-item>
          <a-form-item
                  :wrapper-col="buttonItemLayout.wrapperCol"
          >
            <a-popover title="表单配置" placement="bottom" trigger="click" v-model="settingVisible">
              <template slot="content">
                <div style="width: 480px">
                  <a-checkbox-group :defaultValue="defaultOptions" @change="onTableHeaderChange">
                    <a-row>
                      <a-col :span="8" v-for="(item, index) in options" :key="index">
                        <a-checkbox :value="item.value">{{item.label}}</a-checkbox>
                      </a-col>
                    </a-row>
                  </a-checkbox-group>
                </div>
              </template>
              <a-button type="primary" shape="circle" icon="setting"/>
            </a-popover>
          </a-form-item>
        </a-form>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="columns" :dataSource="tableData"
                     :pagination="paginationProps"
                     @change="handleTableChange" :scroll="{ x: scrollX, y: 550}">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="signState" slot-scope="text">
                <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
              </span>
              <span slot="contractNodes" slot-scope="tags">
                <a-tag v-for="tag in tags" color="green"
                       :key="tag.nodeId">{{tag.nodeDescription}}</a-tag>
              </span>
              <span slot="itemCategory" slot-scope="tag">
                <a-tag v-if="!!tag" color="blue">{{tag}}</a-tag>
              </span>
              <span slot="epc" slot-scope="text">
                <a-icon :style="{color: text ? 'green' : 'red'}" :type="text ? 'check' : 'close'"/>
              </span>
              <span slot="contractFile" slot-scope="text">
                <a-button :disabled="!text.contractId" type="primary" icon="download" :loading="text.isDownload" @click="handleFileDownload(text)">
                  下载文件
                </a-button>
              </span>
              <template slot="selectIndex" slot-scope="text, record">
                <span v-if="role === 'ROLE_ADMIN'">
                  <a @click="handleContractEdit(record)">修改</a>
                  <a-divider type="vertical" />
                </span>
                <a-button v-if="text" type="danger" size="small" @click="handleRemoved(record)">
                  移除
                </a-button>
                <a-button v-else type="primary" size="small" @click="handleSelected(record)">
                  选择
                </a-button>
              </template>
            </a-table>
          </a-spin>
        </div>
        <a-drawer
                title="修改合同"
                placement="right"
                width="550"
                :closable="false"
                @close="onEditClose"
                :visible="editVisible"
        >
          <UpdateContract @refreshData="afterEditData" :formData="this.contractEditData" :projectCategoryList="this.projectCategoryList"></UpdateContract>
        </a-drawer>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import UpdateContract from "../UpdateContract/UpdateContract";
  import moment from "moment";
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
    name: "ListPage",
    components:{
      UpdateContract,
    },
    data() {
      return {
        formLayout: 'inline',
        formItemLayout: {
          labelCol: {span: 5},
          wrapperCol: {span: 19}
        },
        buttonItemLayout: {
          wrapperCol: {span: 14, offset: 0}
        },
        spinning: false,
        contractId: '', // 模糊查询的合同id
        columns: [],
        editVisible: false, // 编辑窗口参数
        contractEditData: [], // 需要编辑的合同表单数据
        popVisible: false, // 选择列表的弹出
        settingVisible: false, // 配置表头菜单弹出控制
        selectValue: [],
        scrollX: 0,
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.contractList.paginationProps, // 分页选项
        tableData: state => state.contractList.tableData, // 合同数据
        selectedRowKeys: state => state.contractList.selectedRowKeys, //选中的keys
        role: state => state.userOperation.role,
        projectCategoryList: state => state.contractList.projectCategoryList,// 项目类型
        selectContractInfo: state => state.contractList.selectContractInfo, // 项目类型
        totalColumns: state => state.contractList.totalColumns, // 表单头部数据
        options: state => state.contractList.options, // 表头总数据
        defaultOptions: state => state.contractList.defaultOptions, // 表头默认数据
      }),
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
      this.getProjectCategoryList();
      this.loadSettingOptions();
      this.loadTableColumns(this.defaultOptions);
    },
    activated() {
      this.updateTableData();
    },
    methods: {
      ...mapMutations({
        addContractInfo: 'contractList/addContractInfo', // 添加选中的合同
        removeContractInfo: 'contractList/removeContractInfo', // 移除选中的合同
        loadSettingOptions: 'contractList/loadSettingOptions', // 加载表头选项
      }),
      ...mapActions({
        downloadContract: 'contractList/downloadContract',
        getContractListById: 'contractList/getContractListById',
        exportContract: 'contractList/exportContract',
        deleteContract: 'contractList/deleteContract',
        getProjectCategoryList: 'contractList/getProjectCategoryList',
        cashExport: 'cashOperation/cashExport'
      }),
      updateTableData() {
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
      handleQuery() {
        this.paginationProps.current = 1;
        this.spinning = true;
        this.updateTableData();
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
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      handleExport() {
        this.exportContract({
          contractIds: this.selectContractInfo.map((item) => {return item.contractId}),
        }).then((data) => {
          if (!data.data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', 'export.xlsx');
          document.body.appendChild(link);
          link.click();
          this.$message.success("导出成功");
        }).catch((error) => {
          this.$message.success("导出失败");
        });
      },
      handleCashExport() {
        this.cashExport({
          contractIds: this.selectContractInfo.map((item) => {return item.contractId}),
        }).then((data) => {
          if (!data.data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data.data]));
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', 'cashReceiptExport.xlsx');
          document.body.appendChild(link);
          link.click();
          this.$message.success("导出成功");
        }).catch((error) => {
          this.$message.success("导出失败");
        });
      },
      handleDelete(){
        this.deleteContract({
          contractIds: this.selectContractInfo.map((item) => {return item.contractId}),
        }).then((data) => {
          this.$message.success('删除成功');
          this.updateTableData();
        }).catch((error) => {
          this.$message.error(error)
        });
      },
      cancelDelete () {
        this.$message.info('取消删除')
      },
      handleContractEdit(selectContractData) {
        // 初始化输入数据
        this.contractEditData = JSON.parse(JSON.stringify(selectContractData));
        let tempNodes = [];
        this.contractEditData.contractNodes.map((item) => {
          tempNodes.push(item.nodeDescription);
        });
        this.contractEditData.contractNodes = tempNodes;
        this.contractEditData.itemCategory = this.projectCategoryList[this.projectCategoryList.findIndex((item) => this.contractEditData.itemCategory === item.projectCategoryName)].projectCategoryId;
        this.contractEditData.contractFilingDate = moment(this.contractEditData.contractFilingDate);
        this.contractEditData.actualSigningDate = moment(this.contractEditData.actualSigningDate);
        this.editVisible = true;
      },
      onEditClose() {
        this.editVisible = false;
      },
      afterEditData() {
        this.editVisible = false;
        this.updateTableData();
      },
      // 处理合同选择
      handleSelected(rowData) {
        rowData.selectIndex = true;
        this.addContractInfo({
          contractId: rowData.contractNum,
          contractName: rowData.contractName
        })
        this.popVisible = true;
      },
      // 处理合同移除
      handleRemoved(rowData) {
        rowData.selectIndex = false;
        this.removeContractInfo(rowData.contractNum);
        this.popVisible = true;
      },
      // 处理表头选择
      onTableHeaderChange(checkedValues) {
        this.loadTableColumns(checkedValues);
      },
      // 排序算法
      compare(property){
        return function(a,b){
          let value1 = a[property];
          let value2 = b[property];
          return value1 - value2;
        }
      },
      // 生成表格样式
      loadTableColumns(data) {
        this.columns = [];
        this.scrollX = 230;
        this.columns.push(this.totalColumns[29]);
        this.columns.push(this.totalColumns[30]);
        data.map(item => {
          this.columns.push(this.totalColumns[item]);
          this.scrollX += this.totalColumns[item].width;
        });
        this.columns = this.columns.sort(this.compare('sort'))
      },
    }
  }
</script>