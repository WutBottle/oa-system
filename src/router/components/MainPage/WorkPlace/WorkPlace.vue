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
        display: flex;
        width: 100%;

        .avatar {
          margin: 0 20px 16px 0;

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
          flex: auto;
          color: rgba(0, 0, 0, .45);
          line-height: 22px;

          .title {
            font-size: 20px;
            line-height: 28px;
            font-weight: 500;
            color: rgba(0, 0, 0, .85);
            margin-bottom: 16px;
            flex: auto;
          }
        }

        .extra {
          flex: 0 1 auto;
          margin-left: 88px;
          min-width: 242px;
          text-align: left;
          width: 375px;

          .info {
            padding: 0 32px 0 0;
          }

          .title {
            color: rgba(0, 0, 0, .45);
            font-size: 14px;
            line-height: 22px;
            margin-bottom: 4px;
          }

          .count {
            color: rgba(0, 0, 0, .85);
            font-size: 20px;
            line-height: 26px;
            margin: 0;
          }
        }
      }
    }

    .page-content {
      padding: 24px;

      .project-doing {
        margin-bottom: 24px;
      }
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
        <div class="avatar">
          <span>
            <img src="@/assets/OA.png" alt="avatar">
          </span>
        </div>
        <div class="content">
          <div class="title">
            {{username}}，天气冷了要加衣服！
          </div>
          <div>
            中南建筑设计院 | CSADI - 第三设计部 - OA平台
          </div>
        </div>
        <div class="extra">
          <a-row>
            <a-col :span="8">
              <div class="info">
                <div class="title">未完成</div>
                <div class="count">{{projectUnDone}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info">
                <div class="title">项目数</div>
                <div class="count">{{projectNum}}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info">
                <div class="title">总收款金额</div>
                <div class="count">{{projectAllCash}}</div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <div class="page-content">
      <a-row :gutter="20">
        <a-col :span="12">
          <div class="project-doing">
            <a-card title="进行中的项目" :bordered="false">
              <a slot="extra" @click="handleDirectTo">全部项目</a>
              <a-card-grid style="width:33.33%;textAlign:'center'" v-for="(item, index) in recentData" :key="index">
                <p>项目名称</p>
                <div style="height: 60px">{{item.contractName}}</div>
              </a-card-grid>
            </a-card>
          </div>
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
                    <a slot="title" href="https://vue.ant.design/">{{item.operateUserName}}<a-divider type="vertical" />{{item.time}}</a>
                    <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </div>
        </a-col>
        <a-col :span="12">
          <div id="chart-wrapper">
            <a-card title="近7天现金回款" :bordered="false">
              <div id="myChart" style="width: 100%;height:50vh;"></div>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import moment from 'moment';

  export default {
    name: "WorkPlace",
    computed: {
      ...mapState({
        username: state => state.tokensOperation.username,// 选择合同数
        menuSelect: state => state.tokensOperation.menuSelect, // 当前menu
      }),
    },
    data() {
      return {
        listData: [],
        recentData: [],
        projectUnDone: '',
        projectNum: '',
        projectAllCash: '',
        recentCashes: [],
        datas: [],
      }
    },
    methods: {
      ...mapMutations({
        setMenu: 'tokensOperation/setMenu',
      }),
      ...mapActions({
        getRecentOperates: 'operateRecordOperation/getRecentOperates',
        getIndexProperties: 'contractList/getIndexProperties',
        getRecentProjectList: 'contractList/getRecentProjectList',
        getRecentCashes: 'cashOperation/getRecentCashes'
      }),
      handleDirectTo() {
        this.$router.push('/main/project');
        this.setMenu('/main/project');
      },
      drawBar(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        // 绘制图表
        myChart.setOption({
          tooltip: {},
          xAxis: {
            data: this.dates,
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
            data: this.recentCashes,
          }]
        });
      },
      addResizeListener() {
        let elementResizeDetectorMaker = require("element-resize-detector");
        let erd = elementResizeDetectorMaker();
        erd.listenTo(document.getElementById("chart-wrapper"), (element) => {
          this.$echarts.init(document.getElementById("myChart")).resize()
        });
      }
    },
    mounted() {
      this.addResizeListener();
    },
    activated() {
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
      this.getIndexProperties().then(res => {
        this.projectUnDone = res.data.data.projectUnDone;
        this.projectNum = res.data.data.projectNum;
        this.projectAllCash = res.data.data.projectAllCash;
      });
      this.getRecentProjectList({
        pageNum: 1,
        pageLimit: 6,
      }).then(res => {
        this.recentData = res.data.data.content;
      });
      this.getRecentCashes({
        recentDays: 7,
      }).then(res => {
        this.recentCashes = res.data.data.recentCashes;
        this.dates = res.data.data.dates;
        this.drawBar();
      });
    },
  }
</script>
