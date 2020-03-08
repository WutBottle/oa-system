<style lang="scss" scoped>
  .ProjectInfo {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    border-top: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    border-radius: 6px;

    .cell {
      height: 40px;
      line-height: 40px;
    }

    .bb {
      border-bottom: 1px solid #e8e8e8;
    }

    .bt {
      border-top: 1px solid #e8e8e8;
    }

    .bl {
      border-left: 1px solid #e8e8e8;
    }

    .br {
      border-right: 1px solid #e8e8e8;
    }

    .b18 {
      font-size: 18px;
      font-weight: bold;
    }

    .b14 {
      font-size: 14px;
      font-weight: bold;
    }

    .bgFCE4D6 {
      background-color: #FCE4D6;
    }

    .bgBDD7EE {
      background-color: #BDD7EE;
    }

    .bgFFD966 {
      background-color: #FFD966;
    }

    .bgFFF2CC {
      background-color: #FFF2CC;
    }

    .bgDDEBF7 {
      background-color: #DDEBF7;
    }

    .bgE2EFDA {
      background-color: #E2EFDA;
    }

    .bgececec {
      background-color: #ececec;
    }

    .bgffe8d9 {
      background-color: rgba(255, 232, 217, 0.6);
    }

    .bgcae7ff {
      background-color: rgba(202, 231, 255, 0.6);
    }

    .bgffd966 {
      background-color: rgba(255, 217, 102, 0.6);
    }

    .click-font {
      cursor: pointer;
      text-decoration: underline;
    }
  }
</style>

<template>
  <div class="ProjectInfo">
    <a-row class="cell bb b14">
      中南建筑设计院股份有限公司第五营销总监部
    </a-row>
    <a-row class="cell bb b18">
      设  计  项  目  基  本  情  况  表
    </a-row>
    <a-row class="bb" style="display: flex;align-items: stretch;">
      <a-col class="b14 br" :span="2" style="display: flex;align-items: center;justify-content: center">
        概况
      </a-col>
      <a-col :span="22">
        <a-row>
          <a-col class="b14 br bb cell" :span="4">设计号</a-col>
          <a-col class="br bb cell" :span="4">{{formData.designId}}</a-col>
          <a-col class="b14 br bb cell" :span="4">项目名称</a-col>
          <a-col class="bb cell" :span="12">{{formData.contractName}}</a-col>
        </a-row>
        <a-row class="cell">
          总建筑面积152954平米，地上148386、地下4568。
        </a-row>
      </a-col>
    </a-row>
    <a-divider />
    <a-row class="bb" style="display: flex;align-items: stretch;">
      <a-col class="b14 br bt" :span="2" style="display: flex;align-items: center;justify-content: center">
        项目经营
      </a-col>
      <a-col :span="22">
        <a-row>
          <a-col class="b14 br bt cell" :span="4">经营负责人</a-col>
          <a-col class="br bt cell" :span="4">{{formData.runningManager && formData.runningManager.staffName}}</a-col>
          <a-col class="b14 br bt cell" :span="4">签约状态</a-col>
          <a-col class="br bt cell" :span="4">已签/洽谈/投标</a-col>
          <a-col class="b14 br bt cell bgFCE4D6 click-font" :span="4" @click="handleContractOpen">
            <a-spin :spinning="contractSpinning">
            合同总额
            </a-spin>
          </a-col>
          <a-col class="bt cell bgFCE4D6" :span="4">{{formData.contractAmount}}</a-col>
        </a-row>
        <template v-if="contractVisible">
          <a-row v-for="(item, index) in contractData" :key="item.id">
            <a-col class="b14 br bt cell bgffe8d9" :span="4">{{index ? ('补充合同' + index) : '主合同'}}</a-col>
            <a-col class="br bt cell bgffe8d9" :span="4">{{item.contractAmount}}</a-col>
            <a-col class="b14 br bt cell bgffe8d9" :span="4">签订日期</a-col>
            <a-col class="br bt cell bgffe8d9" :span="4">{{item.actualDate}}</a-col>
            <a-col class="b14 br bt cell bgffe8d9" :span="4">归档日期</a-col>
            <a-col class="bt cell bgffe8d9" :span="4">{{item.contractDate}}</a-col>
          </a-row>
        </template>
        <a-row>
          <a-col class="b14 br bt cell click-font bgBDD7EE" :span="4" @click="handleReceiptOpen">
            <a-spin :spinning="receiptSpinning">
              累计开票
            </a-spin>
          </a-col>
          <a-col class="br bt cell bgBDD7EE" :span="4">{{formData.receiptAmount}}</a-col>
          <a-col class="b14 br bt cell click-font bgFFD966" :span="4" @click="handleCashOpen">
            <a-spin :spinning="cashSpinning">
              累计收费
            </a-spin>
          </a-col>
          <a-col class="br bt cell bgFFD966" :span="4">{{formData.cashAmount}}</a-col>
          <a-col class="b14 br bt cell" :span="4">未收发票</a-col>
          <a-col class="bt cell" :span="4">{{formData.contractAmount - formData.receiptAmount}}</a-col>
        </a-row>
        <template v-if="receiptVisible">
          <a-row v-for="(item, index) in receiptData" :key="item.receiptId">
            <a-col class="b14 br bt cell bgcae7ff" :span="4">开具发票{{(index +1 )}}</a-col>
            <a-col class="br bt cell bgcae7ff" :span="4">{{item.receiptAmount}}</a-col>
            <a-col class="b14 br bt cell bgcae7ff" :span="4">开票日期</a-col>
            <a-col class="br bt cell bgcae7ff" :span="4">{{item.receiptDate}}</a-col>
            <a-col class="b14 br bt cell bgcae7ff" :span="4">发票号码</a-col>
            <a-col class="bt cell bgcae7ff" :span="4">{{item.receiptId}}</a-col>
          </a-row>
        </template>
        <template v-if="cashVisible">
          <a-row v-for="(item, index) in cashData" :key="item.cashId">
            <a-col class="b14 br bt cell bgffd966" :span="4">收费{{(index +1 )}}</a-col>
            <a-col class="br bt cell bgffd966" :span="4">{{item.cashAmount}}</a-col>
            <a-col class="b14 br bt cell bgffd966" :span="4">到账日期</a-col>
            <a-col class="br bt cell bgffd966" :span="4">{{item.cashDate}}</a-col>
            <a-col class="b14 br bt cell" :span="4"></a-col>
            <a-col class="bt cell" :span="4"></a-col>
          </a-row>
        </template>
        <a-row>
          <a-col class="b14 br bt cell" :span="4">应收比例</a-col>
          <a-col class="br bt cell" :span="4">{{formData.ratio && (100 - formData.ratio.toFixed(4) * 100)}}%</a-col>
          <a-col class="b14 br bt cell" :span="4">应收金额</a-col>
          <a-col class="br bt cell" :span="4">{{formData.contractAmount}}</a-col>
          <a-col class="b14 br bt cell" :span="4"></a-col>
          <a-col class="bt cell" :span="4"></a-col>
        </a-row>
        <a-row>
          <a-col class="b14 br bt cell" :span="4">项目经理</a-col>
          <a-col class="br bt cell" :span="4">{{formData.projectManager && formData.projectManager.staffName}}</a-col>
          <a-col class="b14 br bt cell" :span="4">生产阶段</a-col>
          <a-col class="bt cell" :span="12">概念/方案/初设/施工图/后期</a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-divider />
    <a-row class="bb" style="display: flex;align-items: stretch;">
      <a-col class="b14 br bt" :span="2" style="display: flex;align-items: center;justify-content: center">
        项目生产
      </a-col>
      <a-col :span="22">
        <a-row>
          <a-col class="br bt cell" :span="4">专业/专项</a-col>
          <a-col class="br bt cell" :span="4">组织方式</a-col>
          <a-col class="br bt cell" :span="4">设计团队</a-col>
          <a-col class="br bt cell" :span="4">分项设计费</a-col>
          <a-col class="br bt cell" :span="4">价格（拟）</a-col>
          <a-col class="bt cell" :span="4">备注</a-col>
        </a-row>
        <template v-for="(item, index) in formData.subProjects" >
          <a-row :key="item.subProjectId">
            <a-row>
              <a-col class="br bt cell click-font" :span="4" @click="handleSubCategoryOpen(item, index)">{{item.subCategory.categoryName}}</a-col>
              <a-col class="br bt cell" :span="4">{{item.organization ? item.organization.categoryName : '/'}}</a-col>
              <a-col class="br bt cell" :span="4">{{item.designTeam}}</a-col>
              <a-col class="br bt cell" :span="4">{{item.designFees}}</a-col>
              <a-col class="br bt cell" :span="4">{{item.price}}</a-col>
              <a-col class="bt cell" :span="4">{{item.note}}</a-col>
            </a-row>
            <template v-if="categoryIndex[index]">
              <a-row v-for="data in item.outContracts" :key="data.outContractId">
                <a-col class="br bt cell bgececec" :span="4">{{item.subCategory.categoryName}}-{{data.outContractName}}</a-col>
                <a-col class="br bt cell bgececec" :span="4">{{data.outContractAmount}}</a-col>
                <a-col class="br bt cell bgececec" :span="4">累开发票</a-col>
                <a-col class="br bt cell bgececec" :span="4">/</a-col>
                <a-col class="br bt cell bgececec" :span="4">累计付费</a-col>
                <a-col class="bt cell bgececec" :span="4">{{data.outPaid}}</a-col>
              </a-row>
            </template>
          </a-row>

        </template>
        <a-row>
          <a-col class="br bt cell" :span="4"></a-col>
          <a-col class="br bt cell" :span="4"></a-col>
          <a-col class="br bt cell" :span="4">合计</a-col>
          <a-col class="br bt cell bgFFF2CC" :span="4">{{totalFees}}</a-col>
          <a-col class="br bt cell bgFFF2CC" :span="4">{{totalPrice}}</a-col>
          <a-col class="bt cell bgFFF2CC" :span="4"></a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bb" style="display: flex;align-items: stretch;">
      <a-col class="b14 br bt click-font bgDDEBF7" :span="2" style="display: flex;align-items: center;justify-content: center">
        内部流转
      </a-col>
      <a-col :span="22">
        <a-row style="text-align: left;padding: 12px">
          <a-row>
            本人已对以上生产资源进行组织，并已核对设计合同内容。
          </a-row>
          <a-row style="margin-top: 50px;">
            <a-col :span="14">
              项目经理（签字）：
              <a-radio-group defaultValue="true" size="small">
                <a-radio-button value="true">同意</a-radio-button>
                <a-radio-button value="false">不同意</a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              日期：
            </a-col>
          </a-row>
        </a-row>
        <a-row class="bt" style="text-align: left;padding: 12px">
          <a-row>
            本人已知晓并核对以上信息。
          </a-row>
          <a-row style="margin-top: 50px;">
            <a-col :span="14">
              行政专员（签字）：
              <a-radio-group defaultValue="true" size="small">
                <a-radio-button value="true">同意</a-radio-button>
                <a-radio-button value="false">不同意</a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              日期：
            </a-col>
          </a-row>
        </a-row>
        <a-row class="bt" style="text-align: left;padding: 12px">
          <a-row>
            本人已详细阅读此表，并对以上信息进行校核，同意按此表进行项目运营。
          </a-row>
          <a-row style="margin-top: 50px;">
            <a-col :span="14">
              经营负责人（签字）：
              <a-radio-group defaultValue="true" size="small">
                <a-radio-button value="true">同意</a-radio-button>
                <a-radio-button value="false">不同意</a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              日期：
            </a-col>
          </a-row>
        </a-row>
        <a-row class="bt" style="text-align: left;padding: 12px">
          <a-row>
            同意按此表进行项目运营。
          </a-row>
          <a-row style="margin-top: 50px;">
            <a-col :span="14">
              总监（签字）：
              <a-radio-group defaultValue="true" size="small">
                <a-radio-button value="true">同意</a-radio-button>
                <a-radio-button value="false">不同意</a-radio-button>
              </a-radio-group>
            </a-col>
            <a-col :span="10">
              日期：
            </a-col>
          </a-row>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="bb bgE2EFDA" style="text-align: left;padding: 12px;">
      <p>备注：</p>
      <p>1、此表在主合同签订前，由项目经理填写完毕后交由相关负责人；</p>
      <p>2、如有其他内协、外包项请在“其他”栏中如实填写；</p>
      <p>3、建筑、结构、设备、造价等专业设计费按公司默认比例分配。</p>
    </a-row>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import moment from 'moment';
  export default {
    name: "ProjectInfo",
    props: {
      formData: {
        type: Object,
        default: () => {}
      },
    },
    watch: {
      formData: {
        handler() {
          this.categoryIndex = [];
          this.totalFees = 0;
          this.totalPrice = 0;
          this.formData.subProjects && this.formData.subProjects.map((item) => {
            this.categoryIndex.push(false);
            this.totalFees += item.designFees;
            this.totalPrice += item.price;
          });
        },
        immediate: true
      }
    },
    data() {
      return {
        categoryIndex: [], // 控制分项展开
        totalFees: 0, // 分项设计费总计
        totalPrice: 0, // 分项价格总计
        contractData: [],
        contractVisible: false,
        contractSpinning: false,
        receiptData: [],
        receiptVisible: false,
        receiptSpinning: false,
        cashData: [],
        cashVisible: false,
        cashSpinning: false,
      }
    },
    methods: {
      ...mapActions({
        getContractListByContractId: 'contractList/getContractListByContractId',
        getReceiptsByContractId: 'receiptOperation/getReceiptsByContractId',
        getCashesByContractId: 'cashOperation/getCashesByContractId',
      }),
      handleSubCategoryOpen(item, index) {
        if (item.outContracts.length) {
          this.$set(this.categoryIndex, index, !this.categoryIndex[index])
        } else {
          this.$message.warning('该分项无分包合同！')
        }
      },
      handleContractOpen() {
        if (this.contractVisible === true) {
          this.contractVisible = false;
        } else {
          this.contractSpinning = true;
          const params = {
            contractId: this.formData.contractId,
          };
          this.getContractListByContractId(params).then((res) => {
            if (res.data.meta.success) {
              this.contractData = res.data.data.map(item => {
                return {
                  contractAmount: item.contractAmount,
                  contractDate: moment(item.contractDate).format('YYYY-MM-DD'),
                  actualDate: moment(item.actualDate).format('YYYY-MM-DD'),
                }
              });
              this.contractVisible = true;
            } else {
              this.$message.error(res.data.meta.message);
            }
            this.contractSpinning = false;
          }).catch(error => {
            this.contractSpinning = false;
          })
        }
      },
      handleReceiptOpen() {
        if (this.receiptVisible === true) {
          this.receiptVisible = false;
        } else {
          this.receiptSpinning = true;
          const params = {
            contractId: this.formData.contractId,
          };
          this.getReceiptsByContractId(params).then((res) => {
            if (res.data.meta.success) {
              this.receiptData = res.data.data.receipts.map(item => {
                return {
                  receiptId: item.receiptId,
                  receiptDate: moment(item.receiptDate).format('YYYY-MM-DD'),
                  receiptAmount: item.receiptAmount,
                }
              });
              this.receiptVisible = true;
            } else {
              this.$message.error(res.data.meta.message);
            }
            this.receiptSpinning = false;
          }).catch(error => {
            this.receiptSpinning = false;
          })
        }
      },
      handleCashOpen() {
        if (this.cashVisible === true) {
          this.cashVisible = false;
        } else {
          this.cashSpinning = true;
          const params = {
            contractId: this.formData.contractId,
          };
          this.getCashesByContractId(params).then((res) => {
            if (res.data.meta.success) {
              this.cashData = res.data.data.cashes.map(item => {
                return {
                  cashId: item.cashId,
                  cashDate: moment(item.cashDate).format('YYYY-MM-DD'),
                  cashAmount: item.cashAmount,
                }
              });
              this.cashVisible = true;
            } else {
              this.$message.error(res.data.meta.message);
            }
            this.cashSpinning = false;
          }).catch(error => {
            this.cashSpinning = false;
          })
        }
      },
    }
  }
</script>