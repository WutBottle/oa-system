<style lang="scss" scoped>
  .SubEntryPage {
    .page-content {
      padding: 30px;

      .steps-content {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;
        text-align: center;
        padding-top: 40px;

        .header-wrapper {
          margin-bottom: 18px;
        }

        .table-wrapper {
          padding: 30px;
        }
      }

      .steps-action {
        margin-top: 24px;
      }
    }
  }
</style>

<template>
  <div class="SubEntryPage">
    <HeaderPage title="分项录入"/>
    <div class="page-content">
      <a-row style="background-color: #fff; padding: 24px;">
        <a-steps :current="current">
          <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
        </a-steps>
        <div class="steps-content">
          <template v-if="steps[current].type === 'searchContract'">
            <a-select
                    showSearch
                    :value="contractValue"
                    placeholder="搜索合同号"
                    :showArrow="false"
                    style="width: 300px"
                    :filterOption="false"
                    @search="fetchOutContract"
                    @change="handleChange"
                    notFoundContent="无搜索结果"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in contractsData" :key="d">{{d}}</a-select-option>
            </a-select>
          </template>
          <template v-else>
            <a-spin :spinning="tableSpinning">
              <div class="header-wrapper">
                <h3>合同号：{{this.contractId}}——合同名称：{{this.contractName}}——设计号：{{this.designId}}</h3>
              </div>
              <div class="table-wrapper">
                <a-table bordered :columns="columns" :dataSource="tableData"
                         :pagination="paginationProps"
                         @change="handleTableChange" :scroll="{ x:'max-content', y: 450}">
                  <span slot="serial" slot-scope="text, record, index">
                    {{ index + 1 }}
                  </span>
                  <span slot="operation" slot-scope="text, record">
                    <a @click="handleInvoiceEdit(record)">修改</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除？" @confirm="handleInvoiceDelete(record)" okText="确定" cancelText="取消">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                </a-table>
              </div>
            </a-spin>
          </template>
        </div>
        <div class="steps-action">
          <a-button
                  :disabled="this.contractValue === undefined"
                  v-if="current < steps.length - 1"
                  type="primary" @click="next"
          >
            下一步
          </a-button>
          <a-button
                  v-if="current == steps.length - 1"
                  type="primary"
                  icon="plus"
          >
            新增
          </a-button>
          <a-button
                  v-if="current>0"
                  style="margin-left: 8px"
                  @click="prev"
          >
            上一步
          </a-button>
        </div>
      </a-row>
    </div>
    <a-modal
            title="项目信息表"
            width="90vw"
            v-model="infoVisible"
            okText="提交"
            cancelText="取消"
    >
      <ProjectInfo/>
    </a-modal>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import {debounce} from 'debounce';
  import HeaderPage from "../HeaderPage/HeaderPage";
  import ProjectInfo from "../ProjectPage/ProjectInfo/ProjectInfo";
  export default {
    name: "SubEntryPage",
    components: {
      HeaderPage,
      ProjectInfo
    },
    data() {
      this.fetchOutContract = debounce(this.fetchOutContract, 500);
      return {
        current: 0,
        steps: [{
          title: '选择合同号',
          type: 'searchContract',
        }, {
          title: '添加分项信息',
          type: 'addSub',
        }],
        contractValue: undefined,
        contractsData: [],
        fetching: false,
        tableSpinning: false,
        contractId: '',
        designId: '',
        contractName: '',
        columns: [
          {
            title: '序号',
            width: 70,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          }, {
            title: '分项类别',
            width: 120,
            key: 'subCategory',
            dataIndex: 'subCategory',
          }, {
            title: '组织方式',
            width: 120,
            key: 'organization',
            dataIndex: 'organization',
          }, {
            title: '设计团队',
            width: 120,
            key: 'designTeam',
            dataIndex: 'designTeam',
          }, {
            title: '设计费',
            width: 120,
            key: 'designFees',
            dataIndex: 'designFees',
          }, {
            title: '价格',
            width: 100,
            key: 'price',
            dataIndex: 'price',
          }, {
            title: '备注',
            width: 100,
            key: 'notes',
            dataIndex: 'notes',
          }
        ],
        tableData: [],
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '10', '15'], // 每页数量选项
          total: 0,
          current: 1,
        },
        infoVisible: true,
      }
    },
    methods: {
      ...mapActions({
        getContractIdsByIdLike: 'contractList/getContractIdsByIdLike',
      }),
      next() {
        this.current++;
      },
      prev() {
        this.current--
      },
      fetchOutContract(value) {
        const params = {
          contractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getContractIdsByIdLike(params).then((res) => {
          this.contractsData = res && res.data.data.contractIds;
          this.fetching = false;
        });
      },
      handleChange(value) {
        Object.assign(this, {
          contractValue: value,
          contractsData: [],
          fetching: false,
        })
      },
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
      },
    }
  }
</script>