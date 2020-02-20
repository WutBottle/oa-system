<style lang="scss" scoped>
  .WorkPlace {
    .page-header {
      background: #fff;
      padding: 16px 32px 0;
      border-bottom: 1px solid #e8e8e8;

      .bread {
        margin-bottom: 16px;
      }

      .detail {
        padding-bottom: 16px;
        .left-container {
          display: flex;
          align-items: center;
          .avatar {
            margin-right: 16px;
            span {
              border-radius: 50%;
              display: block;
              width: 72px;
              height: 72px;
              line-height: 72px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .content {
            color: rgba(0, 0, 0, .45);

            .title {
              font-size: 20px;
              line-height: 28px;
              font-weight: 500;
              color: rgba(0, 0, 0, .85);
              margin-bottom: 16px;
              flex: auto;
            }
          }
        }
      }
    }
    .page-content {
      padding: 24px;

    }
  }
</style>

<template>
  <div class="WorkPlace">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>工作台</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="detail">
        <a-row>
          <a-col :span="11">
            <div class="left-container">
              <div class="avatar">
                  <span>
                    <img src="@/assets/OA.png" alt="avatar">
                  </span>
              </div>
              <div class="content">
                <div class="title">
                  {{username}}，武汉只是暂时下线了！
                </div>
                <div>
                  中南建筑设计院 | CSADI - 第三设计部 - OA平台
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span="13">
            <a-affix :style="{ position: 'absolute', top: '-35px'}">
              <a-radio-group v-model="selectMonth" buttonStyle="solid" size="small" @change="handleMonthChange">
                <a-radio-button value="1">一个月</a-radio-button>
                <a-radio-button value="6">半年</a-radio-button>
                <a-radio-button value="3">三个月</a-radio-button>
                <a-radio-button value="12">一年</a-radio-button>
              </a-radio-group>
            </a-affix>
            <a-row style="padding-top: 6px">
              <a-col :span="8">
                <a-statistic title="签订项目合同总数" :value="indexPropertiesData.projectNum" style="margin-right: 10px"/>
              </a-col>
              <a-col :span="8">
                <a-statistic title="现金回款总额" :value="indexPropertiesData.projectAllCash" style="margin-right: 10px">
                  <template v-slot:suffix>
                    <span>元</span>
                  </template>
                </a-statistic>
              </a-col>
              <a-col :span="8">
                <a-statistic title="已开发票总额" :value="indexPropertiesData.projectAllReceipt" style="margin-right: 10px">
                  <template v-slot:suffix>
                    <span>元</span>
                  </template>
                </a-statistic>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="page-content">
      <a-row :gutter="20" style="padding-bottom: 20px">
        <a-col :span="12">
          <div id="receipt-wrapper">
            <a-card title="近七天发票信息" :bordered="false" :bodyStyle="{width:'100%',height:'45vh'}">
              <a-empty v-if="receiptLoading"/>
              <Bar v-else wrapperId="receipt-wrapper" selfId="barReceipt" :barOptions="receiptOptions"/>
            </a-card>
          </div>
        </a-col>
        <a-col :span="12">
          <div id="cash-wrapper">
            <a-card title="近七天现金回款" :bordered="false" :bodyStyle="{width:'100%',height:'45vh'}">
              <a-empty v-if="barLoading"/>
              <Bar v-else wrapperId="cash-wrapper" :barOptions="barOptions"/>
            </a-card>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="dynamic-wrapper">
            <a-card title="动态" :bordered="false">
              <a-list
                      itemLayout="horizontal"
                      :dataSource="listData"
              >
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-list-item-meta
                          :description="item.message"
                  >
                    <a slot="title" href="https://vue.ant.design/">{{item.operateUserName}}
                      <a-divider type="vertical"/>
                      {{item.time}}</a>
                    <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import moment from 'moment';
  import Bar from "../EchartsPage/Bar";

  export default {
    name: "WorkPlace",
    components: {
      Bar,
    },
    computed: {
      ...mapState({
        username: state => state.tokensOperation.username,// 选择合同数
        menuSelect: state => state.tokensOperation.menuSelect, // 当前menu
      }),
    },
    data() {
      return {
        listData: [],
        barLoading: true,
        receiptLoading: true,
        barOptions: {},
        receiptOptions: {},
        selectMonth: '1',
        indexPropertiesData:{},
      }
    },
    activated() {
      this.updateRecentOperates();
      this.updateRecentCashes();
      this.updateIndexData();
      this.updateRecentReceipts();
    },
    methods: {
      ...mapActions({
        getRecentOperates: 'operateRecordOperation/getRecentOperates',
        getRecentCashes: 'cashOperation/getRecentCashes',
        getIndexProperties: 'contractList/getIndexProperties',
        getRecentReceipts: 'receiptOperation/getRecentReceipts',
      }),
      updateRecentReceipts() {
        this.receiptLoading = true;
        this.getRecentReceipts({
          recentDays: 7,
        }).then(res => {
          if (res.data.meta.success) {
            this.receiptOptions = {
              title: {},
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '2%',
                containLabel: true
              },
              xAxis: {
                data: res.data.data.dates,
              },
              yAxis: {},
              dataZoom: [
                {
                  type: 'inside'
                }
              ],
              series: [{
                name: '金额(元)',
                type: 'bar',
                data: res.data.data.recentReceipts,
              }],
            };
            this.receiptLoading = false;
          } else {
            this.$message.error(res.data.meta.message);
          }
        });
      },
      updateRecentOperates() {
        this.getRecentOperates({
          pageNum: 1,
          pageLimit: 6,
        }).then(res => {
          this.listData = res.data.data.content.map(item => {
            return {
              operateUserName: item.operateUserName,
              time: moment(item.operateDate).format('YYYY-MM-DD HH:mm:ss'),
              message: item.message,
            }
          });
        });
      },
      updateRecentCashes() {
        this.barLoading = true;
        this.getRecentCashes({
          recentDays: 7,
        }).then(res => {
          if (res.data.meta.success) {
            this.barOptions = {
              title: {},
              tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '2%',
                containLabel: true
              },
              xAxis: {
                data: res.data.data.dates,
              },
              yAxis: {},
              dataZoom: [
                {
                  type: 'inside'
                }
              ],
              series: [{
                name: '金额(元)',
                type: 'bar',
                data: res.data.data.recentCashes,
              }],
            };
            this.barLoading = false;
          } else {
            this.$message.error(res.data.meta.message);
          }
        });
      },
      updateIndexData() {
        this.getIndexProperties({
          recentMonths: this.selectMonth
        }).then(res => {
          this.indexPropertiesData = res.data.data;
        })
      },
      handleMonthChange() {
        this.updateIndexData();
      }
    },
  }
</script>
