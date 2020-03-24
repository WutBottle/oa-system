<style lang="scss" scoped>
  .OutContractListPage {
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
                  label="外包合同号"
          >
            <a-input style="width: 150px" v-model="outContractId" placeholder="请输入外包合同号"/>
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
                    分包导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="1">
                  <a-button type="primary" @click="handlePaidExport">
                    分包回款导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="2">
                  <a-button type="primary" @click="handleReceiptExport">
                    分包发票导出
                  </a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
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
        </a-form>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="columns" :dataSource="listTableData"
                     :pagination="listPaginationProps"
                     @change="handleTableChange" :scroll="{ x: 2260, y: 500}">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="outContractCategory" slot-scope="id">{{outContractCategoryList[outContractCategoryList.findIndex((item) => item.categoryId === id)].categoryName}}</span>
              <span slot="outProjectCategory" slot-scope="id">{{outProjectCategoryList[outProjectCategoryList.findIndex((item) => item.categoryId === id)].categoryName}}</span>
              <template slot="selectIndex" slot-scope="text, record">
                <span>
                  <a @click="openOutPaid(record)">查看付款</a>
                </span>
                <a-divider type="vertical"/>
                <a-button v-if="text.selectIndex" type="danger" size="small" @click="handleRemoved(record)">
                  移除
                </a-button>
                <a-button v-else type="primary" size="small" @click="handleSelected(record)">
                  选择
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
        </a-table>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";

  const formLayout = 'inline';
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
            width: 130,
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
          }, {
            title: '分包操作',
            width: 160,
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
        outContractCategoryList: [],
        outProjectCategoryList: [],
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
      }),
    },
    mounted() {
      this.getCategoryList({
        categoryType: 1
      }).then(res => {
        this.outContractCategoryList = res && res.data.data;
        this.getCategoryList({
          categoryType: 2
        }).then(res => {
          this.outProjectCategoryList = res && res.data.data;
          this.updateTableData();
        });
      });
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
        getCategoryList: 'categoryOperation/getCategoryList', // 获取类型
      }),
      // 查询处理
      handleQuery() {
        this.listPaginationProps.current = 1;
        this.updateTableData();
      },
      // 导出处理
      handleExport() {
        if (this.selectOutContractInfo.length) {
          this.exportOutContract({
            outContractIds: this.selectOutContractInfo.map((item) => {return item.outContractId}),
          }).then((data) => {
            if (!data.data) {
              return
            }
            let url = window.URL.createObjectURL(new Blob([data.data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', 'outContractsExport.xlsx');
            document.body.appendChild(link);
            link.click();
            this.$message.success("导出成功");
          }).catch((error) => {
            this.$message.error("导出失败");
          });
        } else {
          this.$message.warning('您的选择列表为空！');
        }
      },
      // 分包回款导出
      handlePaidExport() {
        if (this.selectOutContractInfo.length) {
          this.outPaidExport({
            outContractIds: this.selectOutContractInfo.map((item) => {return item.outContractId}),
          }).then((data) => {
            if (!data.data) {
              return
            }
            let url = window.URL.createObjectURL(new Blob([data.data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', 'outPaidExport.xlsx');
            document.body.appendChild(link);
            link.click();
            this.$message.success("导出成功");
          }).catch((error) => {
            this.$message.error("导出失败");
          });
        } else {
         this.$message.warning('您的选择列表为空！');
        }
      },
      // 分包发票导出
      handleReceiptExport() {

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
        const params = {
          outContractId: this.outContractId,
          pageNum: this.listPaginationProps.current,
          pageLimit: this.listPaginationProps.pageSize
        };
        this.getOutContractListByIdLike(params).then((res) => {
          if (!res.data.meta.success) {
            this.$message.error(res.data.meta.message);
          }
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
          pageLimit: this.outPaidPaginationProps.pageSize
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
    }
  }
</script>