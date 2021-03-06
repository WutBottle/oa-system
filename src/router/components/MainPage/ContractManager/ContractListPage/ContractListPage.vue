<style lang="scss" scoped>
  .ContractListPage {
    .form-wrapper {
      margin-bottom: 18px;
    }

    .tr {
      text-align: right;
    }
  }
</style>

<template>
  <div class="ContractListPage">
    <a-form class="form-wrapper" :layout="formLayout">
      <a-form-item
              label="查询关键词"
      >
        <a-input style="width: 150px" v-model="contractId" placeholder="合同号、合同名称"/>
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
        <a-button icon="plus" type="primary" @click="handleAdd">
          新增
        </a-button>
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
          <a-button type="primary" icon="setting">表头配置</a-button>
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
            <a-divider type="vertical" />
            <a-tag v-if="!record.sup" color="green">主合同</a-tag>
            <a-tag v-else color="blue">补充</a-tag>
          </span>
          <div slot="contractAmount" slot-scope="text" class="tr">
            {{numToMoney(text)}}
          </div>
          <div slot="accumulatedCashReceipts" slot-scope="text" class="tr">
            {{numToMoney(text)}}
          </div>
          <div slot="remainingContractAmount" slot-scope="text" class="tr">
            {{numToMoney(text)}}
          </div>
          <div slot="cumulativeInvoicedAmount" slot-scope="text" class="tr">
            {{numToMoney(text)}}
          </div>
          <div slot="invoicedUncollectedAmount" slot-scope="text" class="tr">
            {{numToMoney(text)}}
          </div>
          <div slot="investmentAmount" slot-scope="text" class="tr">
            {{numToMoney(text / 10000)}}
          </div>
          <div slot="projectScale" slot-scope="text" class="tr">
            {{text}}
          </div>
          <span slot="signState" slot-scope="text">
            <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
          </span>
          <span slot="productionStageName" slot-scope="text">
            <a-tag v-if="text" color="green">{{text}}</a-tag>
          </span>
          <span slot="itemCategory" slot-scope="tag">
            <a-tag v-if="!!tag" color="blue">{{tag}}</a-tag>
          </span>
          <span slot="epc" slot-scope="text">
            <a-icon :style="{color: text ? 'green' : 'red'}" :type="text ? 'check' : 'close'"/>
          </span>
          <span slot="projectManagerNode" slot-scope="text">
            {{text.username}}
            <a-divider type="vertical" />
            <a-tag color="orange">
              {{text.nickname}}
            </a-tag>
          </span>
          <span slot="projectSecretaryNode" slot-scope="text">
            {{text.username}}
            <a-divider type="vertical" />
            <a-tag color="orange">
              {{text.nickname}}
            </a-tag>
          </span>
          <span slot="financeManagerNode" slot-scope="text">
            {{text.username}}
            <a-divider type="vertical" />
            <a-tag color="orange">
              {{text.nickname}}
            </a-tag>
          </span>
          <span slot="runningManagerNode" slot-scope="text">
            {{text.username}}
            <a-divider type="vertical" />
            <a-tag color="orange">
              {{text.nickname}}
            </a-tag>
          </span>
          <a-progress slot="receivedProportion" slot-scope="text" type="circle" :percent="text" :width="60"/>
          <span slot="inspectorNode" slot-scope="text">
            {{text.username}}
            <a-divider type="vertical" />
            <a-tag color="orange">
              {{text.nickname}}
            </a-tag>
          </span>
          <span slot="contractFile" slot-scope="text">
            <a-button :disabled="!text.contractId" type="primary" icon="download" :loading="text.isDownload" @click="handleFileDownload(text)">
              下载文件
            </a-button>
          </span>
          <template slot="operation" slot-scope="text, record">
            <a @click="handleContractEdit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm
                    @confirm="handleDelete(record)"
                    okText="确定"
                    cancelText="取消"
            >
              <div slot="title">
                确定要删除
                <span v-if="!record.sup" style="color: #ff0000;">主合同</span>
                <span v-else style="color: #00aaff;">补充合同</span>
                ？
              </div>
              <a>删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-spin>
    </div>
    <a-drawer
            title="修改合同"
            placement="right"
            width="600"
            :closable="false"
            @close="onEditClose"
            :visible="editVisible"
    >
      <UpdateContract @refreshData="afterEditData" :formData="this.contractEditData" :projectCategoryList="this.projectCategoryList" :productionStageList="this.productionStageList"></UpdateContract>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import UpdateContract from "./UpdateContract/UpdateContract";
  import moment from "moment";
  import numToMoney from '@utils/numToMoney';
  import {INFINITY} from "@/store/mutation-types";

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
    name: "ContractListPage",
    components:{
      UpdateContract,
    },
    data() {
      return {
        formLayout: 'inline',
        formItemLayout: {
          labelCol: {span: 7},
          wrapperCol: {span: 17}
        },
        buttonItemLayout: {
          wrapperCol: {span: 14, offset: 0}
        },
        formTailLayout: {
          labelCol: {span: 4},
          wrapperCol: {span: 8, offset: 7},
        },
        contractId: '',
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40', 'Infinity'], // 每页数量选项
          total: 0,
          current: 1,
        },
        tableData: [],
        spinning: false,
        columns: [],
        editVisible: false, // 编辑窗口参数
        contractEditData: [], // 需要编辑的合同表单数据
        popVisible: false, // 选择列表的弹出
        settingVisible: false, // 配置表头菜单弹出控制
        scrollX: 0,
        projectCategoryList: [],
        productionStageList: [],
        numToMoney,
      }
    },
    computed: {
      ...mapState({
        role: state => state.tokensOperation.role,
        totalColumns: state => state.contractList.totalColumns, // 表单头部数据
        options: state => state.contractList.options, // 表头总数据
        defaultOptions: state => state.contractList.defaultOptions, // 表头默认数据
      }),
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
      },
    },
    mounted() {
      this.loadSettingOptions();
      this.loadTableColumns(this.defaultOptions);
      this.updateTableData();
      this.getCategoryList({
        categoryType: 3
      }).then(res => {
        this.projectCategoryList = res && res.data.data;
      });
      this.getCategoryList({
        categoryType: 6
      }).then(res => {
        this.productionStageList = res && res.data.data;
      });
    },
    activated() {
      const {contractId = ''} = this.$router.currentRoute.query;
      this.contractId = contractId;
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
        getContractListByIdLike: 'contractList/getContractListByIdLike',
        deleteContract: 'contractList/deleteContract',
        getCategoryList: 'categoryOperation/getCategoryList', // 获取类型
      }),
      // 查询处理
      handleQuery() {
        this.paginationProps.current = 1;
        this.updateTableData();
      },
      regionFilter(type) {
        if (type === 1) {
          return '市内';
        } else if (type === 2) {
          return '省内';
        } else if (type === 3) {
          return '省外';
        }else return '';
      },
      setPageInfo(data) {
        this.tableData = data.content.map((item, index) => {
          return {
            key: index,
            id: item.id,
            contractNum: item.contractId, // 合同号
            signState: item.isSign, // 签约状态
            designNum: item.designId, // 设计号
            employerContractNum: item.ownerId, // 发包人合同编号
            contractName: item.contractName, // 合同名称
            contractAmount: item.contractAmount, // 合同额(元)
            accumulatedCashReceipts: item.cashAmount, // 累计现金回款(元)
            remainingContractAmount: item.contractRemain, // 剩余合同额(元)
            receivedProportion: !isNaN(item.ratio) && Number((item.ratio * 100).toFixed(2)), // 已收款比例
            cumulativeInvoicedAmount: item.receiptAmount, // 累计开票金额(元)
            invoicedUncollectedAmount: item.receiptNotCash, // 已开发票未收款金额
            actualSigningDate: moment(item.actualDate).format('YYYY-MM-DD'), // 实际签约日期
            contractFilingDate: moment(item.contractDate).format('YYYY-MM-DD'), // 合同归档日期
            itemCategory: !item.projectCategory ? '' : item.projectCategory.categoryName, // 项目类别
            productionStage: item.productionStage ? item.productionStage.categoryId : undefined, // 生产阶段
            productionStageName: item.productionStage ? item.productionStage.categoryName : undefined, // 生产阶段
            mainDesignDepartment: item.departmentDesign, // 主设计部门
            managementDepartment: item.departmentRunning, // 经营部门
            projectManager: item.projectManager ? item.projectManager.userId : undefined, // 项目经理
            projectSecretary: item.projectSecretary ? item.projectSecretary.userId : undefined, // 商务专员
            financeManager: item.financeManager ? item.financeManager.userId : undefined, // 财务专员
            runningManager: item.runningManager ? item.runningManager.userId : undefined, // 项目经营负责人
            inspector: item.inspector ? item.inspector.userId : undefined, // 部门经营负责人
            projectManagerNode: {
              username: item.projectManager ? item.projectManager.username : undefined,
              nickname: item.projectManager ? item.projectManager.nickname : undefined,
              userId: item.projectManager ? item.projectManager.userId : undefined,
              role: item.projectManager ? item.projectManager.roles[0].name : undefined,
            }, // 项目经理
            runningManagerNode: {
              username: item.runningManager ? item.runningManager.username : undefined,
              nickname: item.runningManager ? item.runningManager.nickname : undefined,
              userId: item.runningManager ? item.runningManager.userId : undefined,
              role: item.runningManager ? item.runningManager.roles[0].name : undefined,
            }, // 项目经营负责人
            projectSecretaryNode: {
              username: item.projectSecretary ? item.projectSecretary.username : undefined,
              nickname: item.projectSecretary ? item.projectSecretary.nickname : undefined,
              userId: item.projectSecretary ? item.projectSecretary.userId : undefined,
              role: item.projectSecretary ? item.projectSecretary.roles[0].name : undefined,
            }, // 商务专员
            financeManagerNode: {
              username: item.financeManager ? item.financeManager.username : undefined,
              nickname: item.financeManager ? item.financeManager.nickname : undefined,
              userId: item.financeManager ? item.financeManager.userId : undefined,
              role: item.financeManager ? item.financeManager.roles[0].name : undefined,
            }, // 财务专员
            inspectorNode: {
              username: item.inspector ? item.inspector.username : undefined,
              nickname: item.inspector ? item.inspector.nickname : undefined,
              userId: item.inspector ? item.inspector.userId : undefined,
              role: item.inspector ? item.inspector.roles[0].name : undefined,
            }, // 部门经营负责人
            contractingParty: item.owner, // 发包方
            investmentAmount: item.investment, // 投资额(万元)
            projectScale: (item.aboveGroundArea || item.underGroundArea) && ('地上' + this.numToMoney(item.aboveGroundArea) + '+地下' + this.numToMoney(item.underGroundArea)), // 项目规模(平方米)
            aboveGroundArea: item.aboveGroundArea, // 地上面积(平方米)
            underGroundArea: item.underGroundArea, // 地下面积(平方米)
            region: this.regionFilter(item.region), // 地域
            regionId: item.region,
            regionalKeyWords: item.district, // 地区关键词
            class1: item.buildOne, // 建筑一级分类
            class2: item.buildTwo, // 建筑二级分类
            epc: item.epc, // 是否EPC项目
            currentFile: item.contractFile,
            contractFile: {
              isDownload: false,
              contractId: item.contractFile ?  item.id: '',
            }, // 合同扫描文件
            sup: item.sup, // 是否是补充文件
            note: item.note, // 备注
          }
        });
      },
      updateTableData() {
        this.spinning = true;
        const params = {
          contractId: this.contractId,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize === Infinity ? INFINITY : this.paginationProps.pageSize,
        };
        this.getContractListByIdLike(params).then((res) => {
          if (res.data.meta.success) {
            this.paginationProps.total = res.data.data.totalElements;
            this.setPageInfo(res.data.data);
            this.spinning = false;
          } else {
            this.$message.error(res.data.meta.message);
            this.spinning = false;
          }
        }).catch((error) => {
          this.spinning = false;
        });
      },
      handleFileDownload(contractFile) {
        this.$message.warning("下载中，请稍等！");
        contractFile.isDownload = true;
        this.downloadContract({
          id: contractFile.contractId,
        }).then((data) => {
          if (!data.data) {
            return
          }
          const blob = new Blob([data.data]);
          const filename = contractFile.contractId + '.pdf';
          if('msSaveOrOpenBlob' in navigator){
            //ie使用的下载方式
            window.navigator.msSaveOrOpenBlob(blob, filename);
            contractFile.isDownload = false;
            this.$message.success("下载成功");
          }else{
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            contractFile.isDownload = false;
            this.$message.success("下载成功");
            document.removeChild(link);
          }
        }).catch((error) => {
          contractFile.isDownload = false;
        });
      },
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      handleFinalDelete() {
        const finalPage = Math.ceil(this.paginationProps.total / this.paginationProps.pageSize);
        if (this.tableData.length === 1 && this.paginationProps.current != 1 && this.paginationProps.current === finalPage) {
          this.paginationProps.current--;
        }
      },
      handleDelete(data){
        this.deleteContract({
          ids: [data.id],
        }).then((data) => {
          this.handleFinalDelete();
          this.$message.success('删除成功');
          this.updateTableData();
        })
      },
      handleContractEdit(selectContractData) {
        // 初始化输入数据
        this.contractEditData = JSON.parse(JSON.stringify(selectContractData));
        this.contractEditData.itemCategory = this.contractEditData.itemCategory ? this.projectCategoryList[this.projectCategoryList.findIndex((item) => this.contractEditData.itemCategory === item.categoryName)].categoryId : undefined;
        this.contractEditData.contractFilingDate = this.contractEditData.actualSigningDate === 'Invalid date' ? null : moment(this.contractEditData.contractFilingDate);
        this.contractEditData.actualSigningDate = this.contractEditData.actualSigningDate === 'Invalid date' ? null : moment(this.contractEditData.actualSigningDate);
        this.contractEditData.investmentAmount = this.contractEditData.investmentAmount && this.contractEditData.investmentAmount / 10000;
        const currentUserOptions = [
          this.contractEditData.projectManagerNode,
          this.contractEditData.runningManagerNode,
          this.contractEditData.projectSecretaryNode,
          this.contractEditData.financeManagerNode,
          this.contractEditData.inspectorNode,
        ];
        Object.assign(this.contractEditData, {
          currentUserOptions: currentUserOptions
        });
        this.editVisible = true;
      },
      onEditClose() {
        this.editVisible = false;
      },
      afterEditData() {
        this.editVisible = false;
        this.updateTableData();
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
        this.scrollX = 260;
        this.columns.push(this.totalColumns[31]);
        this.columns.push(this.totalColumns[32]);
        data.map(item => {
          this.columns.push(this.totalColumns[item]);
          this.scrollX += this.totalColumns[item].width;
        });
        this.columns = this.columns.sort(this.compare('sort'))
      },
      handleAdd() {
        this.$emit('showAddModal');
      },
      onChange(lowerBound, upperBound) {
        if (this[lowerBound] && this[upperBound] && this[upperBound] < this[lowerBound]) {
          let temp = this[lowerBound];
          this[lowerBound] = this[upperBound];
          this[upperBound] = temp;
        }
      },
    }
  }
</script>