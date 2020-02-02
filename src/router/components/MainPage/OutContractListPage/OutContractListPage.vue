<style lang="scss" scoped>
  .OutContractListPage {
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
      }
    }
  }
</style>

<template>
  <div class="OutContractListPage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>分包列表</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">分包列表</p>
    </div>
    <div class="page-content">
      <div class="content-wrapper">
        <a-form class="form-wrapper" :layout="formLayout">
          <a-form-item
                  label="外包合同号"
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input v-model="outContractId" placeholder="请输入外包合同号"/>
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
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="columns" :dataSource="listTableData"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                     :pagination="listPaginationProps"
                     @change="handleTableChange" :scroll="{ x: 'max-content', y: 500}">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="outContractCategory" slot-scope="id">{{outContractCategoryList[outContractCategoryList.findIndex((item) => item.outContractCategoryId === id)].outContractCategoryName}}</span>
              <span slot="outProjectCategory" slot-scope="id">{{outProjectCategoryList[outProjectCategoryList.findIndex((item) => item.outProjectCategoryId === id)].outProjectCategoryName}}</span>
            </a-table>
          </a-spin>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import moment from "moment";

  const formLayout = 'inline';
  const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 14}
  };
  const buttonItemLayout = {
    wrapperCol: {span: 14, offset: 0}
  };
  export default {
    name: "OutContractListPage",
    data() {
      return {
        formLayout,
        formItemLayout,
        buttonItemLayout,
        outContractId: '', // 模糊查询的外包合同号
        outContractIds: [], // 选择的外包合同id
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
          }, {
            title: '分包合同名称',
            width: 150,
            key: 'outContractName',
            dataIndex: 'outContractName',
          }, {
            title: '合同号',
            width: 150,
            key: 'contractId',
            dataIndex: 'contractId',
          }, {
            title: '设计号',
            width: 150,
            key: 'designId',
            dataIndex: 'designId',
          }, {
            title: '合同名称',
            width: 150,
            key: 'contractName',
            dataIndex: 'contractName',
          }, {
            title: '分包合同金额(元)',
            width: 150,
            key: 'outContractAmount',
            dataIndex: 'outContractAmount',
          }, {
            title: '已付费金额(元)',
            width: 150,
            key: 'outPaid',
            dataIndex: 'outPaid',
          }, {
            title: '未付费金额(元)',
            width: 150,
            key: 'outUnpaid',
            dataIndex: 'outUnpaid',
          }, {
            title: '已付费比例',
            width: 150,
            key: 'ratio',
            dataIndex: 'ratio',
          }, {
            title: '实际归档日期',
            width: 200,
            key: 'outContractDate',
            dataIndex: 'outContractDate',
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
          }],

      }
    },
    computed: {
      ...mapState({
        selectedRowKeys: state => state.outContractOperation.selectedRowKeys, //选中的keys
        role: state => state.userOperation.role, // 角色信息
        listTableData: state => state.outContractOperation.listTableData, // 选中的keys
        listPaginationProps: state => state.outContractOperation.listPaginationProps, // 分页控制
        outContractCategoryList: state => state.outContractOperation.outContractCategoryList, // 外包类型选项
        outProjectCategoryList: state => state.outContractOperation.outProjectCategoryList, // 外包项目类型
      }),
    },
    mounted() {
      this.getOutContractCategoryList().then(() => {
        this.getOutProjectCategoryList().then(() => {
          this.updateTableData();
        }).catch((error) => {
          this.$message.error(error);
        });
      }).catch((error) => {
        this.$message.error(error);
      });
    },
    methods: {
      ...mapMutations({
        setSelectedRowKeys: 'outContractOperation/setSelectedRowKeys', // 设置选中的keys
      }),
      ...mapActions({
        getOutContractListByIdLike: 'outContractOperation/getOutContractListByIdLike',
        getOutContractCategoryList: 'outContractOperation/getOutContractCategoryList', // 获取分包类型
        getOutProjectCategoryList: 'outContractOperation/getOutProjectCategoryList', // 获取分包项目类型
      }),
      // 查询处理
      handleQuery() {
        this.listPaginationProps.current = 1;
        this.updateTableData();
      },
      // 导出处理
      handleExport() {

      },
      // 批量删除外包合同
      handleDelete() {

      },
      // 取消删除外包合同
      cancelDelete() {

      },
      // 处理对list中的合同选择
      onSelectChange(selectedRowKeys) {
        this.outContractIds = [];
        selectedRowKeys.forEach((item) => {
          this.outContractIds.push(this.listTableData[item].outContractId)
        });
        this.setSelectedRowKeys(selectedRowKeys);
      },
      // 选择每页个数
      handleTableChange(pagination) {
        this.spinning = true;
        this.listPaginationProps.current = pagination.current;
        this.listPaginationProps.pageSize = pagination.pageSize;
        const params = {
          outContractId: this.outContractId,
          pageNum: pagination.current,
          pageLimit: pagination.pageSize
        };
        this.getOutContractListByIdLike(params).then((data) => {
          this.spinning = false;
        }).catch((error) => {
          this.spinning = false;
          this.$message.error(error);
        });
      },
      // 更新列表数据
      updateTableData() {
        this.spinning = true;
        this.setSelectedRowKeys([]);
        const params = {
          outContractId: this.outContractId,
          pageNum: this.listPaginationProps.current,
          pageLimit: this.listPaginationProps.pageSize
        };
        this.getOutContractListByIdLike(params).then((data) => {
          this.spinning = false;
        }).catch((error) => {
          this.spinning = false;
          this.$message.error(error);
        });
      },
    }
  }
</script>