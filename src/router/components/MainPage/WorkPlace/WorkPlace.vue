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
          display: -ms-flexbox; /* 兼容IE */
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
              -ms-flex: auto; /* 兼容IE */
            }
          }
        }
      }
    }

    .page-content {
      padding: 24px;

      .demo-infinite-container {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        padding: 8px 24px;
        height: 200px;
      }

      .demo-loading-container {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
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
        <a-row>
          <a-col :span="11">
            <div class="left-container">
              <div class="avatar">
                  <span>
                    <img :src="avatarSetting[role]" alt="avatar">
                  </span>
              </div>
              <div class="content">
                <div class="title">
                  {{username}}，欢迎使用本系统！
                </div>
                <div>
                  中南建筑设计院 | CSADI - EPC中心 - OA平台
                </div>
              </div>
            </div>
          </a-col>
          <a-col style="position: relative;" v-if="role === '超级管理员' || role === '部门负责人'" :span="13">
            <div style="position: absolute; top: -38px;">
              选择统计年份：
              <a-select v-model="selectMonth" size="small" style="width: 100px" @change="handleMonthChange">
                <template v-for="(item, index) in new Array(new Date().getFullYear() - 2015)">
                  <a-select-option  :key="index" :value="new Date().getFullYear() - index">
                    {{new Date().getFullYear() - index}}
                  </a-select-option>
                </template>
              </a-select>
            </div>
            <a-row style="padding-top: 6px">
              <a-col :span="8">
                <a-statistic title="签订项目合同总数" :value="indexPropertiesData && indexPropertiesData.projectNum" style="margin-right: 10px"/>
              </a-col>
              <a-col :span="8">
                <a-statistic title="现金回款总额" :value="indexPropertiesData && numToMoney(indexPropertiesData.projectAllCash)" style="margin-right: 10px">
                  <template v-slot:suffix>
                    <span>元</span>
                  </template>
                </a-statistic>
              </a-col>
              <a-col :span="8">
                <a-statistic title="已开发票总额" :value="indexPropertiesData && numToMoney(indexPropertiesData.projectAllReceipt)" style="margin-right: 10px">
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
      <a-row style="padding-bottom: 16px">
        <TaskAssign/>
      </a-row>
      <a-row :gutter="16" style="padding-bottom: 16px">
        <a-col :span="12">
          <a-card>
            <a-badge slot="title" status="error" text="未完成待办事项"/>
            <a slot="extra" @click="() => this.memorandumAddVisible = true">添加</a>
            <div
                    class="demo-infinite-container"
                    v-infinite-scroll="handleUndoneOnLoad"
                    :infinite-scroll-disabled="undoneBusy"
                    :infinite-scroll-distance="10"
            >
              <a-list :dataSource="memorandumUndoneData" size="small">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <div style="display: flex;display: -ms-flex;align-items: center">
                    <span style="width: 76px;">
                      <a-tag v-if="item.remain < 0" color="grey">
                        已过期
                      </a-tag>
                      <a-tag v-else-if="item.remain < 8" color="red">
                        剩余{{item.remain}}天
                      </a-tag>
                      <a-tag v-else color="blue">
                        剩余{{item.remain}}天
                      </a-tag>
                    </span>
                    <a-divider type="vertical"/>
                    <span style="flex: 1;-ms-flex: 1;">{{item.content}}</span>
                  </div>
                  <a-popconfirm slot="actions" title="确定已完成？" @confirm="confirmDone(item)">
                    <a>完成</a>
                  </a-popconfirm>
                  <a slot="actions" @click="handleEditOperation(item)">编辑</a>
                  <a-popconfirm slot="actions" title="确定删除？" @confirm="confirmDeleteUndone(item)">
                    <a-icon slot="icon" type="question-circle-o" style="color: red" />
                    <a>删除</a>
                  </a-popconfirm>
                </a-list-item>
                <div v-if="undoneLoading && !undoneBusy" class="demo-loading-container">
                  <a-spin/>
                </div>
              </a-list>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card>
            <a-badge slot="title" status="success" text="已完成待办事项"/>
            <div
                    class="demo-infinite-container"
                    v-infinite-scroll="handleDoneOnLoad"
                    :infinite-scroll-disabled="doneBusy"
                    :infinite-scroll-distance="10"
            >
              <a-list :dataSource="memorandumDoneData" size="small">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <div style="display: flex;display: -ms-flex;align-items: center">
                    <span style="width: 76px;">
                      <a-tag color="green">
                        {{item.finishDate}}
                      </a-tag>
                    </span>
                    <a-divider type="vertical"/>
                    <span style="flex: 1;-ms-flex: 1;">{{item.content}}</span>
                  </div>
                  <a-popconfirm slot="actions" title="确定删除？" @confirm="confirmDeleteDone(item)">
                    <a-icon slot="icon" type="question-circle-o" style="color: red" />
                    <a>删除</a>
                  </a-popconfirm>
                </a-list-item>
                <div v-if="doneLoading && !doneBusy" class="demo-loading-container">
                  <a-spin/>
                </div>
              </a-list>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="16" style="padding-bottom: 16px">
        <a-col :span="12">
          <div id="receipt-wrapper">
            <a-card title="近七天发票信息" :bordered="false" :bodyStyle="{width:'100%',height:'45vh'}">
              <Bar wrapperId="receipt-wrapper" ref="receiptBar"/>
            </a-card>
          </div>
        </a-col>
        <a-col :span="12">
          <div id="cash-wrapper">
            <a-card title="近七天现金回款" :bordered="false" :bodyStyle="{width:'100%',height:'45vh'}">
              <Bar wrapperId="cash-wrapper" ref="cashBar"/>
            </a-card>
          </div>
        </a-col>
      </a-row>
      <a-row v-if="role === '超级管理员'">
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
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-modal title="添加备忘事项"
             v-model="memorandumAddVisible"
             @ok="handleMemorandumAdd"
             okText="提交"
             cancelText="取消"
             :afterClose="handleMemorandumAddClose"
             :maskClosable="false">
      <a-form
              :form="addForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="备忘事项"
        >
          <a-textarea
                  v-decorator="[
          'content',
          {rules: [{required: true, message: '请输入备忘事项!'}]}
        ]"
                  :autoSize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入备忘事项"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="截止日期"
        >
          <a-date-picker
                  v-decorator="['targetDate',  {
        rules: [{ type: 'object', required: true, message: '请输入截止日期!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="修改备忘事项"
             v-model="memorandumEditVisible"
             @ok="handleMemorandumEdit"
             okText="提交"
             cancelText="取消"
             :afterClose="handleMemorandumEditClose"
             :maskClosable="false">
      <a-form
              :form="editForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="备忘事项"
        >
          <a-textarea
                  v-decorator="[
          'content',
          {initialValue: this.editFormData.content, rules: [{required: true, message: '请输入备忘事项!'}]}
        ]"
                  :autoSize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入备忘事项"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="截止日期"
        >
          <a-date-picker
                  v-decorator="['targetDate',  {
        initialValue: this.editFormData.targetDate,
        rules: [{ type: 'object', required: true, message: '请输入截止日期!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import moment from 'moment';
  import Bar from "../EchartsPage/Bar";
  import TaskAssign from "./TaskAssign/TaskAssign";
  import numToMoney from "@utils/numToMoney";

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  export default {
    name: "WorkPlace",
    components: {
      Bar,
      TaskAssign,
    },
    computed: {
      ...mapState({
        username: state => state.tokensOperation.username,// 选择合同数
        menuSelect: state => state.tokensOperation.menuSelect, // 当前menu
        role: state => state.tokensOperation.role, // 角色
      }),
    },
    data() {
      return {
        formItemLayout,
        numToMoney,
        listData: [],
        barOptions: {},
        selectMonth: new Date().getFullYear(),
        indexPropertiesData: {},
        memorandumAddVisible: false, // 控制添加备忘
        addForm: this.$form.createForm(this),
        memorandumEditVisible: false, // 控制修改备注
        editForm: this.$form.createForm(this),
        editFormData: {},
        memorandumUndoneData: [],
        undoneLoading: false,
        undoneBusy: false,
        undonePaginationProps: {
          pageNum: 1,
          pageLimit: 5,
          total: 6,
        },
        memorandumDoneData: [],
        doneLoading: false,
        doneBusy: false,
        donePaginationProps: {
          pageNum: 1,
          pageLimit: 5,
          total: 6,
        },
        avatarSetting: {
          部门负责人: require('@/assets/总监.png'),
          超级管理员: require('@/assets/超级管理员.png'),
          普通用户: require('@/assets/普通用户.png'),
        },
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
        addMemorandum: 'memorandumOperation/addMemorandum',
        getMemorandumListUndone: 'memorandumOperation/getMemorandumListUndone',
        getMemorandumListDone: 'memorandumOperation/getMemorandumListDone',
        finishMemorandum: 'memorandumOperation/finishMemorandum',
        deleteMemorandum: 'memorandumOperation/deleteMemorandum',
        verifyMemorandum: 'memorandumOperation/verifyMemorandum'
      }),
      updateRecentReceipts() {
        this.getRecentReceipts({
          recentDays: 7,
        }).then(res => {
          if (res && res.data.meta.success) {
            this.$refs.receiptBar.drawBar({
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
            });
          } else {
            this.$message.error('网络错误');
          }
        });
      },
      updateRecentOperates() {
        this.getRecentOperates({
          pageNum: 1,
          pageLimit: 6,
        }).then(res => {
          this.listData = res && res.data.data.content.map(item => {
            return {
              operateUserName: item.operateUserName,
              time: moment(item.operateDate).format('YYYY-MM-DD HH:mm:ss'),
              message: item.message,
            }
          });
        });
      },
      updateRecentCashes() {
        this.getRecentCashes({
          recentDays: 7,
        }).then(res => {
          if (res && res.data.meta.success) {
            this.$refs.cashBar.drawBar({
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
            })
          } else {
            this.$message.error('网络错误');
          }
        });
      },
      updateIndexData() {
        this.getIndexProperties({
          recentMonths: this.selectMonth
        }).then(res => {
          this.indexPropertiesData = res && res.data.data;
        })
      },
      handleMonthChange() {
        this.updateIndexData();
      },
      handleMemorandumAdd() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                content: values.content,
                targetDate: values.targetDate,
              };
              this.addMemorandum(params).then((res) => {
                if (res && res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.addForm.resetFields();
                  this.resetUndoneList();
                  this.handleUndoneOnLoad();
                  this.memorandumAddVisible = false;
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      handleMemorandumEdit() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                memorandumId: this.editFormData.memorandumId,
                content: values.content,
                targetDate: values.targetDate,
              };
              this.verifyMemorandum(params).then((res) => {
                if (res && res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.addForm.resetFields();
                  this.resetUndoneList();
                  this.handleUndoneOnLoad();
                  this.memorandumEditVisible = false;
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      handleMemorandumAddClose() {
        this.addForm.resetFields();
      },
      handleMemorandumEditClose() {
        this.editForm.resetFields();
      },
      resetUndoneList() {
        this.memorandumUndoneData = [];
        this.undonePaginationProps = {
          pageNum: 1,
          pageLimit: 5,
          total: 6,
        };
      },
      resetDoneList() {
        this.memorandumDoneData = [];
        this.donePaginationProps = {
          pageNum: 1,
          pageLimit: 5,
          total: 6,
        };
      },
      handleUndoneOnLoad() {
        this.undoneLoading = true;
        const data = this.memorandumUndoneData;
        if (data.length === this.undonePaginationProps.total) {
          this.$message.warning('已加载到底部');
          this.undoneBusy = true;
          this.undoneLoading = false;
          return;
        }
        this.getMemorandumListUndone({
          pageNum: this.undonePaginationProps.pageNum,
          pageLimit: this.undonePaginationProps.pageLimit,
        }).then(res => {
          if (res && res.data.data.totalPages > this.undonePaginationProps.pageNum) {
            this.undonePaginationProps.pageNum++;
          }
          this.memorandumUndoneData = data.concat(res.data.data.content.map(item => {
            return {
              memorandumId: item.memorandumId,
              targetDate: moment(item.targetDate).format('YYYY-MM-DD'),
              content: item.content,
              remain: item.remain,
            };
          }));
          this.undonePaginationProps.total = res.data.data.totalElements;
          this.undoneLoading = false;
        });
      },
      handleDoneOnLoad() {
        this.doneLoading = true;
        const data = this.memorandumDoneData;
        if (data.length === this.donePaginationProps.total) {
          this.$message.warning('已加载到底部');
          this.doneBusy = true;
          this.doneLoading = false;
          return;
        }
        this.getMemorandumListDone({
          pageNum: this.donePaginationProps.pageNum,
          pageLimit: this.donePaginationProps.pageLimit,
        }).then(res => {
          if (res.data.data.totalPages > this.donePaginationProps.pageNum) {
            this.donePaginationProps.pageNum++;
          }
          this.memorandumDoneData = data.concat(res.data.data.content.map(item => {
            return {
              memorandumId: item.memorandumId,
              finishDate: moment(item.finishDate).format('YYYY-MM-DD'),
              content: item.content,
            };
          }));
          this.donePaginationProps.total = res.data.data.totalElements;
          this.doneLoading = false;
        });
      },
      confirmDone(data) {
        this.finishMemorandum({
          memorandumId: data.memorandumId,
        }).then(res => {
          if (res.data.meta.success) {
            this.resetUndoneList();
            this.resetDoneList();
            this.handleUndoneOnLoad();
            this.handleDoneOnLoad();
          } else {
            this.$message.error('操作失败')
          }
        });
      },
      confirmDeleteUndone(data) {
        this.deleteMemorandum({
          memorandumId: data.memorandumId,
        }).then(res => {
          if (res.data.meta.success) {
            this.resetUndoneList();
            this.handleUndoneOnLoad();
          } else {
            this.$message.error('删除失败')
          }
        });
      },
      confirmDeleteDone(data) {
        this.deleteMemorandum({
          memorandumId: data.memorandumId,
        }).then(res => {
          if (res.data.meta.success) {
            this.resetDoneList();
            this.handleDoneOnLoad();
          } else {
            this.$message.error('删除失败')
          }
        });
      },
      handleEditOperation(data) {
        this.editFormData = Object.assign({
          memorandumId: data.memorandumId,
          content: data.content,
          targetDate: moment(data.targetDate)
        });
        this.memorandumEditVisible = true;
      }
    },
  }
</script>
