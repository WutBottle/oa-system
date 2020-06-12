<style lang="scss" scoped>
  .ApprovalManagement {
    .page-content {
      padding: 24px;

      .form-wrapper {
        margin-bottom: 18px;
      }
    }
  }
</style>

<template>
  <div class="ApprovalManagement">
    <HeaderPage title="审批管理"/>
    <div class="page-content">
      <div style="background-color: #fff;padding: 24px">
        <a-form class="form-wrapper" :layout="formLayout">
          <a-form-item
                  label="查询关键词"
          >
            <a-input style="width: 200px" v-model="contractId" placeholder="合同号、合同名称"/>
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
                     @change="handleTableChange" :scroll="{ y: 550 }">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="state" slot-scope="text">
                <a-tag v-if="text === 0">待发起</a-tag>
                <a-tag v-if="text === 1" color="blue">审批中</a-tag>
                <a-tag v-if="text === 2" color="green">已通过</a-tag>
                <a-tag v-if="text === 3 && role != '超级管理员'" color="red">已驳回</a-tag>
                <a-tag v-if="text === 4" color="red">人员未齐</a-tag>
              </span>
              <template slot="operation" slot-scope="text, record">
                <a-button type="primary" size="small" @click="handleOpen(record)">
                  详情
                </a-button>
                <a-divider type="vertical"/>
                <a-button :disabled="record.state === 4" type="primary" size="small" @click="openDetail(record)">
                  审批
                </a-button>
              </template>
            </a-table>
          </a-spin>
        </div>
      </div>
    </div>
    <a-modal
            title="项目信息"
            v-model="projectInfoVisible"
            width="90vw"
            :footer="null"
    >
      <ProjectInfo :formData="projectInfoData" :projectUsers="projectUsers"/>
    </a-modal>
    <a-modal
            title="审批详情"
            v-model="approvalVisible"
            width="800px"
            :footer="null"
    >
      <StepsComponent :processStatus="processStatus"/>
      <div style="height: 360px;overflow: auto;margin: 24px 0px">
        <a-list
                size="small"
                itemLayout="horizontal"
                :dataSource="commentsData"
        >
          <div slot="header" style="font-size: 18px;font-weight: bold;">审批意见</div>
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta
                    :description="item.content ? item.content : '暂无意见'"
            >
              <div slot="title">
                <span>{{item.name}}</span>
                <a-divider type="vertical"/>
                <a-tooltip :title="isNaN(item.datetime) ? '暂无时间' : item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                  <span>{{isNaN(item.datetime) ? '暂无时间' : item.datetime.fromNow()}}</span>
                </a-tooltip>
                <a-divider v-if="(index + 1)%5 === 1" type="vertical"/>
                <a-tag v-if="(index + 1)%5 === 1" color="blue">第{{item.auditIndex + 1}}轮审批</a-tag>
              </div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
      <a-textarea placeholder="请输入审批意见" :rows="4" v-model="adviseValue"/>
      <div style="padding-top: 12px;">
        <a-button type="primary" :disabled="buttonState" @click="handleChecked('agree')">同意</a-button>
        <a-button type="danger" :disabled="buttonState" style="margin-left: 12px;" @click="handleChecked('disagree')">
          不同意
        </a-button>
        <a-button type="primary" v-if="this.role != '超级管理员' && startButton" style="margin-left: 12px;"
                  @click="handleChecked('restart')">启动审批
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import HeaderPage from "../HeaderPage/HeaderPage";
  import {mapActions, mapState} from "vuex";
  import moment from 'moment';
  import ProjectInfo from "../ProjectPage/ProjectInfo/ProjectInfo";
  import StepsComponent from "./StepsComponent/StepsComponent";

  export default {
    name: "ApprovalManagement",
    components: {
      HeaderPage,
      ProjectInfo,
      StepsComponent,
    },
    data() {
      return {
        formLayout: 'inline',
        contractId: '',
        spinning: false,
        columns: [
          {
            title: '序号',
            dataIndex: 'serial',
            width: '10%',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          },
          {
            title: '合同号',
            key: 'contractId',
            width: '18%',
            dataIndex: 'contractId',
          },
          {
            title: '合同名称',
            key: 'contractName',
            width: '21%',
            dataIndex: 'contractName',
          },
          {
            title: '设计号',
            key: 'designId',
            width: '18%',
            dataIndex: 'designId',
          },
          {
            title: '项目状态',
            key: 'state',
            width: '15%',
            dataIndex: 'state',
            scopedSlots: {customRender: 'state'}
          },
          {
            title: '项目审批',
            key: 'operation',
            width: '18%',
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'}
          },
        ],
        tableData: [],
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40'], // 每页数量选项
          total: 0,
          current: 1,
        },
        approvalVisible: false,
        currentState: [],
        commentsData: [],
        adviseValue: undefined,
        circulationId: '',
        buttonState: true,
        selectedProjectId: '',
        currentUserState: null, // 当前用户对应选中项目的状态
        projectManagerId: null, // 当前选中项目的项目经理id
        startButton: false,
        projectInfoVisible: false,
        projectUsers: [],
        projectInfoData: {},
        tempSubProjects: [],
        processStatus: [],
      }
    },
    computed: {
      ...mapState({
        role: state => state.tokensOperation.role,
        userId: state => state.tokensOperation.userId,
        subCategoryList: state => state.categoryOperation.subCategoryList,
      }),
    },
    watch:{
      subCategoryList: {
        immediate: true,
        handler() {
          this.subCategoryList.map(item => {
            this.tempSubProjects.push({
              organization: null,
              subCategory: {
                categoryId: item.categoryId,
                categoryType: item.categoryType,
                categoryName: item.categoryName,
              },
              outContracts: [],
              designTeam: null,
              designFees: 0,
              price: 0,
              note: null,
            })
          });
        }
      }
    },
    mounted() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        getProjectListByIdLike: 'contractList/getProjectListByIdLike',
        getHistoryByContractId: 'projectCirculationOperation/getHistoryByContractId',
        verifyProjectCirculation: 'projectCirculationOperation/verifyProjectCirculation',
        getProjectByContractId: 'contractList/getProjectByContractId',
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
              if (this.selectedProjectId === item.id) {
                this.currentUserState = item.state;
              }
              return {
                key: index,
                id: item.id,
                contractId: item.contractId,
                designId: item.designId,
                contractName: item.contractName,
                state: item.state,
                projectManagerId: item.projectManagerId,
                aboveGroundArea: item.aboveGroundArea,
                underGroundArea: item.underGroundArea
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
        this.paginationProps.current = 1;
        this.updateTableData();
      },
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      updateDetailData() {
        this.startButton = false;
        if (this.currentUserState === 1 && this.role != '超级管理员') {
          this.buttonState = false;
        }
        this.getHistoryByContractId({
          id: this.selectedProjectId,
        }).then(res => {
          if (res.data.data.length) {
            this.commentsData = [];
            this.currentState = res.data.data[0].states;
            this.circulationId = res.data.data[0].id;
            this.processStatus = [];
            this.currentState.map((item, index) => {
              if (item === 3) {
                if (String(this.userId) === String(this.projectManagerId)) {
                  this.startButton = true;
                }
                this.buttonState = true;
              }
              this.processStatus.push(item);
            });
            res.data.data.map(item => {
              this.commentsData.push({
                name: "项目经理",
                auditIndex: item.auditIndex,
                state: item.projectManagerNode.state,
                content: item.projectManagerNode.note,
                datetime: moment(item.projectManagerNode.createDate),
              }, {
                name: "商务专员",
                auditIndex: item.auditIndex,
                state: item.projectSecretaryNode.state,
                content: item.projectSecretaryNode.note,
                datetime: moment(item.projectSecretaryNode.createDate),
              }, {
                name: "财务专员",
                auditIndex: item.auditIndex,
                state: item.financeManagerNode.state,
                content: item.financeManagerNode.note,
                datetime: moment(item.financeManagerNode.createDate),
              }, {
                name: "项目经营负责人",
                auditIndex: item.auditIndex,
                state: item.runningManagerNode.state,
                content: item.runningManagerNode.note,
                datetime: moment(item.runningManagerNode.createDate),
              }, {
                name: "部门经营负责人",
                auditIndex: item.auditIndex,
                state: item.inspectorNode.state,
                content: item.inspectorNode.note,
                datetime: moment(item.inspectorNode.createDate),
              })
            });
          }
        })
      },
      openDetail(selectData) {
        this.approvalVisible = true;
        this.selectedProjectId = selectData.id;
        // 数据初始化
        this.currentState = [];
        this.commentsData = [];
        this.adviseValue = undefined;
        this.circulationId = '';
        this.currentUserState = selectData.state;
        this.projectManagerId = selectData.projectManagerId;
        this.updateDetailData();
      },
      handleChecked(isAgree) {
        let state;
        switch (isAgree) {
          case 'agree':
            state = 2;
            break;
          case 'disagree':
            state = 3;
            break;
          case 'restart':
            state = 1;
            break;
        }
        if (isAgree === 'restart' || this.adviseValue) {
          this.verifyProjectCirculation({
            id: this.circulationId,
            state: state,
            note: this.adviseValue || '',
          }).then(res => {
            if (res.data.meta.success) {
              isAgree !== 'restart' && this.$message.success(res.data.data);
              isAgree === 'restart' && this.$message.success('重启成功!');
              this.adviseValue = undefined;
              this.currentUserState = null;
              if (isAgree === 'restart' && String(this.userId) === String(this.projectManagerId)) {
                this.currentUserState = 1;
              }
              this.buttonState = true;
              this.updateDetailData();
              this.updateTableData();
            } else {
              this.$message.error(res.data.meta.success);
            }
          })
        } else {
          this.$message.error('请输入审批意见！')
        }
      },
      handleOpen(selectData) {
        this.projectInfoVisible = true;
        this.getHistoryByContractId({
          id: selectData.id,
        }).then(res => {
          this.projectUsers = res && res.data.data;
        });
        this.getProjectByContractId({
          contractId: selectData.contractId
        }).then(res => {
          this.projectInfoData = res && res.data.data.contract;
          Object.assign(this.projectInfoData, {
            aboveGroundArea: selectData.aboveGroundArea,
            underGroundArea: selectData.underGroundArea
          });
          let tempSubProjects = JSON.parse(JSON.stringify(this.tempSubProjects));
          this.projectInfoData.subProjects.map(item => {
            tempSubProjects[tempSubProjects.findIndex(tempItem => item.subCategory.categoryId === tempItem.subCategory.categoryId)] = item;
          });
          this.projectInfoData.subProjects = tempSubProjects;
        });
      },
    }
  }
</script>