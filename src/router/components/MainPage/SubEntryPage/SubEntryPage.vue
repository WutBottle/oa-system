<style lang="scss" scoped>
  .SubEntryPage {
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
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>分项分包管理</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">分项分包管理
        <OutContractInput/>
      </p>
    </div>
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
                    placeholder="搜索合同号、合同名称"
                    :showArrow="false"
                    style="width: 300px"
                    :filterOption="false"
                    @search="fetchOutContract"
                    @change="handleChange"
                    notFoundContent="无搜索结果"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in contractsData" :key="d.contractId">
                {{d.contractId}}
                <a-divider type="vertical"/>
                {{d.contractName}}
              </a-select-option>
            </a-select>
          </template>
          <template v-if="steps[current].type === 'addSub'">
            <a-spin :spinning="tableSpinning">
              <div class="header-wrapper">
                <h3>设计号：{{this.designId}}——合同号：{{this.contractId}}——合同名称：{{this.contractName}}</h3>
              </div>
              <div class="table-wrapper">
                <a-table bordered :columns="columns" :dataSource="tableData"
                         :pagination="paginationProps"
                         @change="handleTableChange" :scroll="{ x: 1400, y: 450}">
                  <span slot="serial" slot-scope="text, record, index">
                    {{ index + 1 }}
                  </span>
                  <span slot="operation" slot-scope="text, record">
                    <a @click="handleSubProjectEdit(record)">修改</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除？" @confirm="handleSubProjectDelete(record)" okText="确定" cancelText="取消">
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                  <span slot="handleAddOutContract" slot-scope="text, record">
                     <a @click="handleAddOutContract(record)">添加分包</a>
                  </span>
                  <span slot="subCategory" slot-scope="text">{{text ? text : '/'}}</span>
                  <span slot="organization" slot-scope="text">{{text ? text : '/'}}</span>
                </a-table>
              </div>
            </a-spin>
          </template>
          <template v-if="steps[current].type === 'handleAddOutContract'">
            <a-spin :spinning="outContractTableSpinning">
              <div class="header-wrapper">
                <h3>设计号：{{this.designId}}——分项类别：{{this.currentSubCategory}}</h3>
              </div>
              <div class="table-wrapper">
                <a-table bordered :columns="outContractColumns" :dataSource="outContractTableData"
                         :pagination="outContractPaginationProps"
                         @change="handleOutContractTableChange" :scroll="{ x: 1900, y: 450}">
                  <span slot="serial" slot-scope="text, record, index">
                    {{ index + 1 }}
                  </span>
                  <span slot="operation" slot-scope="text, record">
                    <a @click="handleOutContractEdit(record)">修改</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除？" @confirm="handleOutContractDelete(record)" okText="确定" cancelText="取消">
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
                  v-if="current < steps.length - 2"
                  type="primary"
                  @click="next"
          >
            下一步
          </a-button>
          <a-button
                  v-if="current == steps.length - 2"
                  style="margin-left: 8px"
                  type="primary"
                  icon="plus"
                  @click="() => this.addVisible = true"
          >
            新增分项
          </a-button>
          <a-button
                  v-if="current == steps.length - 1"
                  style="margin-left: 8px"
                  type="primary"
                  icon="plus"
                  @click="() => this.outContractAddVisible = true"
          >
            新增分包
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
            title="新增分项信息"
            v-model="addVisible"
            @ok="submitForm"
            okText="提交"
            cancelText="取消"
            :afterClose="handleAddClose"
            :maskClosable="false"
    >
      <a-form
              :form="addForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="分项类别"
        >
          <a-select
                  v-decorator="[
          'subCategory',
          {rules: [{
            required: true, message: '请选择分项类别!'
          }]}
        ]"
                  placeholder="请选择分项类别"
          >
            <template v-for="option in subCategoryList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="组织方式 "
        >
          <a-select
                  v-decorator="[
          'organization',
        ]"
                  placeholder="请选择组织方式"
          >
            <template v-for="option in organizationList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="设计团队"
        >
          <a-input
                  v-decorator="[
          'designTeam',
        ]"
                  placeholder="请输入设计团队"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="设计费(元)"
        >
          <a-input
                  v-decorator="[
          'designFees',
          {rules: [{
            required: true, message: '请输入设计费!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入设计费"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包金额(元)"
        >
          <a-input
                  v-decorator="[
          'price',
        ]"
                  placeholder="分包金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'note',
          {rules: [{max: 250, message: '不超过250个字符'}]}
        ]"
                  placeholder="请输入备注"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
            title="修改分项信息"
            placement="right"
            :closable="false"
            width="550"
            @close="onEditClose"
            :visible="editVisible"
    >
      <a-form
              :form="editForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="分项类别"
        >
          <a-select
                  v-decorator="[
          'subCategory',
          {initialValue: this.editFormData.subCategoryId ? this.editFormData.subCategoryId : undefined,
          rules: [{
            required: true, message: '请选择分项类别!'
          }]}
        ]"
                  placeholder="请选择分项类别"
          >
            <template v-for="option in subCategoryList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="组织方式 "
        >
          <a-select
                  v-decorator="[
          'organization',
          {initialValue: this.editFormData.organizationId ? this.editFormData.organizationId : undefined}
        ]"
                  placeholder="请选择组织方式"
          >
            <template v-for="option in organizationList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="设计团队"
        >
          <a-input
                  v-decorator="[
          'designTeam',
          {initialValue: this.editFormData.designTeam}
        ]"
                  placeholder="请输入设计团队"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="设计费(元)"
        >
          <a-input
                  v-decorator="[
          'designFees',
          {initialValue: this.editFormData.designFees, rules: [{
            required: true, message: '请输入设计费!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入设计费"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包金额(元)"
        >
          <a-input
                  v-decorator="[
          'price',
          {initialValue: this.editFormData.price}
        ]"
                  placeholder="请输入分包金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'note',
          {initialValue: this.editFormData.note, rules: [{max: 250, message: '不超过250个字符'}]}
        ]"
                  placeholder="请输入备注"
          />
        </a-form-item>
        <a-form-item
                :label-col="formTailLayout.labelCol"
                :wrapper-col="formTailLayout.wrapperCol"
        >
          <a-button
                  type="primary"
                  @click="submitEditForm"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
    <a-modal
            title="新增分包合同"
            v-model="outContractAddVisible"
            @ok="submitOutContractForm"
            okText="提交"
            cancelText="取消"
            :afterClose="handleOutContractAddClose"
            :maskClosable="false"
    >
      <a-form
              :form="addOutContractForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同号"
        >
          <a-input
                  v-decorator="[
          'outContractId',
          {rules: [{
            required: true, message: '请输入分包合同号!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {
                  if(value){
                    return Number(value);
                  }
                },
          }]}
        ]"
                  placeholder="请输入分包合同号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同名称"
        >
          <a-input
                  v-decorator="[
          'outContractName',
          {rules: [{required: true, message: '请输入分包合同名称!'}]}
        ]"
                  placeholder="请输入分包合同名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包单位名称"
        >
          <a-input
                  v-decorator="[
          'outCompanyName',
          {rules: [{required: true, message: '请输入分包单位名称!'}]}
        ]"
                  placeholder="请输入分包单位名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="实际归档日期"
        >
          <a-date-picker
                  v-decorator="['outContractDate',  {
        rules: [{ type: 'object', required: true, message: '请输入实际归档日期!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同金额(元)"
        >
          <a-input
                  v-decorator="[
          'outContractAmount',
          {rules: [{
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {
                  if(value){
                    return Number(value);
                  }
                },
          }]}
        ]"
                  placeholder="请输入分包合同金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包类型"
        >
          <a-select
                  v-decorator="[
          'outContractCategory',
        ]"
                  placeholder="请选择分包类型"
          >
            <template v-for="option in outContractCategoryList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包项目类别"
        >
          <a-select
                  v-decorator="[
          'outProjectCategory',
        ]"
                  placeholder="请选择分包项目类别"
          >
            <template v-for="option in outProjectCategoryList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'note',
          {rules: [{max: 250, message: '不超过250个字符'}]}
        ]"
                  placeholder="请输入备注"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
            title="修改分包合同"
            placement="right"
            :closable="false"
            width="550"
            @close="onOutContractEditClose"
            :visible="outContractEditVisible"
    >
      <a-form
              :form="editOutContractForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同号"
        >
          <a-input
                  disabled
                  v-decorator="[
          'outContractId',
          {initialValue: this.outContractEditFormData.outContractId, rules: [{required: true, message: '请输入分包合同号!'}]}
        ]"
                  placeholder="请输入分包合同号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同名称"
        >
          <a-input
                  v-decorator="[
          'outContractName',
          {initialValue: this.outContractEditFormData.outContractName, rules: [{required: true, message: '请输入分包合同名称!'}]}
        ]"
                  placeholder="请输入分包合同名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包单位名称"
        >
          <a-input
                  v-decorator="[
          'outCompanyName',
          {initialValue: this.outContractEditFormData.outCompanyName, rules: [{required: true, message: '请输入分包单位名称!'}]}
        ]"
                  placeholder="请输入分包单位名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="实际归档日期"
        >
          <a-date-picker
                  v-decorator="[
          'outContractDate',
          {initialValue:this.outContractEditFormData.outContractDate, rules: [{ type: 'object', required: true, message: '请输入开票日期!' }]}
          ]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包合同金额(元)"
        >
          <a-input
                  v-decorator="[
          'outContractAmount',
          {initialValue: this.outContractEditFormData.outContractAmount, rules: [{
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {
                  if(value){
                    return Number(value);
                  }
                },
          }]}
        ]"
                  placeholder="请输入分包合同金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包类型"
        >
          <a-select
                  v-decorator="[
          'outContractCategory',
          {initialValue: this.outContractEditFormData.outContractCategoryId}
        ]"
                  placeholder="请选择分包类型"
          >
            <template v-for="option in outContractCategoryList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="分包项目类别"
        >
          <a-select
                  v-decorator="[
          'outProjectCategory',
          {initialValue: this.outContractEditFormData.outProjectCategoryId}
        ]"
                  placeholder="请选择分包项目类别"
          >
            <template v-for="option in outProjectCategoryList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'note',
          {initialValue: this.outContractEditFormData.note, rules: [{max: 250, message: '不超过250个字符'}]}
        ]"
                  placeholder="请输入备注"
          />
        </a-form-item>
        <a-form-item
                :label-col="formTailLayout.labelCol"
                :wrapper-col="formTailLayout.wrapperCol"
        >
          <a-button
                  type="primary"
                  @click="submitOutContractEditForm"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import OutContractInput from "../OutContractInput/OutContractInput";
  import {debounce} from 'debounce';
  import moment from "moment";

  const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 12},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };

  export default {
    name: "SubEntryPage",
    components: {
      OutContractInput,
    },
    computed: {
      ...mapState({
        outContractPaginationProps: state => state.outContractOperation.paginationProps,// 分页控制
        outContractTableData: state => state.outContractOperation.tableData, // 列表数据
      }),
    },
    data() {
      this.fetchOutContract = debounce(this.fetchOutContract, 500);
      return {
        formItemLayout,
        formTailLayout,
        current: 0,
        steps: [{
          title: '选择合同',
          type: 'searchContract',
        }, {
          title: '添加分项信息',
          type: 'addSub',
        }, {
          title: '添加分包信息',
          type: 'handleAddOutContract',
        }],
        contractValue: undefined,
        contractsData: [],
        fetching: false,
        tableSpinning: false,
        outContractTableSpinning: false,
        contractId: '',
        designId: '',
        contractName: '',
        currentSubCategory: '', // 当前分项类别
        columns: [
          {
            title: '序号',
            width: 100,
            fixed: 'left',
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          }, {
            title: '分项类别',
            width: 150,
            key: 'subCategory',
            dataIndex: 'subCategory',
            scopedSlots: {customRender: 'subCategory'},
          }, {
            title: '组织方式',
            width: 150,
            key: 'organization',
            dataIndex: 'organization',
            scopedSlots: {customRender: 'organization'},
          }, {
            title: '设计团队',
            width: 200,
            key: 'designTeam',
            dataIndex: 'designTeam',
          }, {
            title: '设计费',
            width: 200,
            key: 'designFees',
            dataIndex: 'designFees',
            sorter: (a, b) => a.designFees - b.designFees,
          }, {
            title: '分包金额',
            width: 200,
            key: 'price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
          }, {
            title: '备注',
            width: 200,
            key: 'note',
            dataIndex: 'note',
          }, {
            title: '添加分包',
            width: 100,
            fixed: 'right',
            key: 'handleAddOutContract',
            scopedSlots: {customRender: 'handleAddOutContract'},
          }, {
            title: '编辑分项',
            width: 120,
            fixed: 'right',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }
        ],
        tableData: [],
        paginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40'], // 每页数量选项
          total: 0,
          current: 1,
        },
        addVisible: false,
        addForm: this.$form.createForm(this),
        subCategoryList: [], // 分项类别
        organizationList: [], // 组织方式
        editVisible: false,
        editForm: this.$form.createForm(this),
        editFormData: {}, // 编辑当前表单数据
        currentSubProjectId: '', // 当前选中的分项id
        outContractColumns: [
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
            title: '分包单位名称',
            width: 150,
            key: 'outCompanyName',
            dataIndex: 'outCompanyName',
          }, {
            title: '分包合同金额(元)',
            width: 150,
            key: 'outContractAmount',
            dataIndex: 'outContractAmount',
            sorter: (a, b) => a.outContractAmount - b.outContractAmount,
          }, {
            title: '已付费金额(元)',
            width: 150,
            key: 'outPaid',
            dataIndex: 'outPaid',
            sorter: (a, b) => a.outPaid - b.outPaid,
          }, {
            title: '未付费金额(元)',
            width: 150,
            key: 'outUnpaid',
            dataIndex: 'outUnpaid',
            sorter: (a, b) => a.outUnpaid - b.outUnpaid,
          }, {
            title: '已付费比例',
            width: 150,
            key: 'ratio',
            dataIndex: 'ratio',
            sorter: (a, b) => a.ratio - b.ratio,
          }, {
            title: '实际归档日期',
            width: 150,
            key: 'outContractDate',
            dataIndex: 'outContractDate',
            sorter: (a, b) => new Date(a.outContractDate) - new Date(b.outContractDate),
          }, {
            title: '分包类型',
            width: 150,
            key: 'outContractCategory',
            dataIndex: 'outContractCategory',
          }, {
            title: '分包项目类别',
            width: 200,
            key: 'outProjectCategory',
            dataIndex: 'outProjectCategory',
          }, {
            title: '备注',
            width: 150,
            key: 'note',
            dataIndex: 'note',
          }, {
            title: '编辑分包',
            width: 130,
            fixed: 'right',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }],
        outContractCategoryList: [], // 分包类型
        outProjectCategoryList: [], // 分包项目类型
        outContractEditFormData: {}, // 编辑当前表单数据
        outContractEditVisible: false, // 编辑分包窗口控制
        outContractAddVisible: false, // 弹出框控制
        addOutContractForm: this.$form.createForm(this),
        editOutContractForm: this.$form.createForm(this),
      }
    },
    mounted() {
      this.getCategoryList({
        categoryType: 1
      }).then(res => {
        this.outContractCategoryList = res && res.data.data;
      });
      this.getCategoryList({
        categoryType: 2
      }).then(res => {
        this.outProjectCategoryList = res && res.data.data;
      });
      this.getCategoryList({
        categoryType: 4
      }).then(res => {
        this.subCategoryList = res && res.data.data;
      });
      this.getCategoryList({
        categoryType: 5
      }).then(res => {
        this.organizationList = res && res.data.data;
      })
    },
    methods: {
      ...mapActions({
        getContractIdsByIdLike: 'contractList/getSubContractIdsByIdLike',
        getCategoryList: 'categoryOperation/getCategoryList',
        addSubProject: 'subProjectOperation/addSubProject',
        deleteSubProject: 'subProjectOperation/deleteSubProject',
        getSubProjectListById: 'subProjectOperation/getSubProjectListById',
        verifySubProject: 'subProjectOperation/verifySubProject',
        getOutContractListBySubId: 'outContractOperation/getOutContractListBySubId',
        addOutContract: 'outContractOperation/addOutContract', // 添加分包合同
        deleteOutContract: 'outContractOperation/deleteOutContract',
        verifyOutContract: 'outContractOperation/verifyOutContract', // 修改分包合同
      }),
      next() {
        this.current++;
        this.updateTableData();
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
          this.contractsData = res && res.data.data.content;
          this.fetching = false;
        });
      },
      handleChange(value) {
        Object.assign(this, {
          contractValue: value,
          fetching: false,
        })
      },
      handleTableChange(pagination) {
        this.paginationProps.current = pagination.current;
        this.paginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      // 更新分项列表数据
      updateTableData() {
        this.tableSpinning = true;
        const params = {
          contractId: this.contractValue,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
        };
        this.getSubProjectListById(params).then((res) => {
          if (res.data.data) {
            this.paginationProps.total = res.data.data.subProjects.totalElements;
            this.contractId = res.data.data.contractId;
            this.designId = res.data.data.designId;
            this.contractName = res.data.data.contractName;
            this.tableData = res.data.data.subProjects.content.map((item, index) => {
              return {
                key: index,
                subProjectId: item.subProjectId,
                subCategory: item.subCategory && item.subCategory.categoryName,
                organization: item.organization && item.organization.categoryName,
                subCategoryId: item.subCategory && item.subCategory.categoryId,
                organizationId: item.organization && item.organization.categoryId,
                designTeam: item.designTeam,
                designFees: item.designFees,
                price: item.price,
                note: item.note,
              }
            });
          } else {
            this.current = 0;
            this.contractValue = undefined;
            this.$message.error(res.data.meta.message);
          }
          this.tableSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
          this.tableSpinning = false;
        });
      },
      // 添加分项信息
      submitForm() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                contractId: this.contractValue,
                subProjects: [{
                  subCategory: values.subCategory && {
                    categoryId: values.subCategory
                  },
                  organization: values.organization && {
                    categoryId: values.organization
                  },
                  designTeam: values.designTeam,
                  designFees: values.designFees,
                  price: values.price,
                  note: values.note,
                }],
              };
              this.addSubProject(params).then((res) => {
                if (res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.addForm.resetFields();
                  this.updateTableData();
                  this.addVisible = false;
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
      handleAddClose() {
        // 关闭添加弹窗后还原数据
        this.addForm.resetFields();
      },
      handleSubProjectDelete(selectInvoiceData) {
        const params = {
          subProjectIds: [selectInvoiceData.subProjectId]
        };
        this.deleteSubProject(params).then((res) => {
          this.updateTableData();
          this.$message.success(res.data.data)
        }).catch((error) => {
          this.$message.error(error);
        })
      },
      handleSubProjectEdit(selectInvoiceData) {
        this.editForm.resetFields();
        this.editFormData = JSON.parse(JSON.stringify(selectInvoiceData));
        this.editVisible = true;
      },
      onEditClose() {
        this.editVisible = false;
      },
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                subProjectId: this.editFormData.subProjectId,
                subCategory: values.subCategory && {
                  categoryId: values.subCategory
                },
                organization: values.organization && {
                  categoryId: values.organization
                },
                designTeam: values.designTeam,
                designFees: values.designFees,
                price: values.price,
                note: values.note,
              };
              this.verifySubProject(params).then((res) => {
                if (res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.editForm.resetFields();
                  this.editVisible = false;
                  this.updateTableData();
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
      handleAddOutContract(selectData) {
        this.currentSubProjectId = selectData.subProjectId;
        this.currentSubCategory = selectData.subCategory;
        this.current++;
        this.updateOutContractTableData();
      },
      handleOutContractTableChange(pagination) {
        this.outContractPaginationProps.current = pagination.current;
        this.outContractPaginationProps.pageSize = pagination.pageSize;
        this.updateOutContractTableData();
      },
      // 更新分包列表数据
      updateOutContractTableData() {
        this.outContractTableSpinning = true;
        const params = {
          subProjectId: this.currentSubProjectId,
          pageNum: this.outContractPaginationProps.current,
          pageLimit: this.outContractPaginationProps.pageSize
        };
        this.getOutContractListBySubId(params).then((data) => {
          if (!data.data.data) {
            this.current--;
            this.$message.error(data.data.meta.message);
          }
          this.outContractTableSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
          this.outContractTableSpinning = false;
        });
      },
      handleOutContractEdit(selectOutContractData) {
        this.outContractEditFormData = JSON.parse(JSON.stringify(selectOutContractData));
        this.outContractEditFormData.outContractDate = moment(this.outContractEditFormData.outContractDate);
        this.outContractEditVisible = true;
      },
      handleOutContractDelete(selectOutContractData) {
        const params = {
          outContractIds: [selectOutContractData.outContractId]
        };
        this.deleteOutContract(params).then((res) => {
          this.updateOutContractTableData();
          this.$message.success(res.data.data)
        }).catch((error) => {
          this.$message.error(error);
        })
      },
      onOutContractEditClose() {
        this.outContractEditVisible = false;
      },
      handleOutContractAddClose() {
        // 关闭添加弹窗后还原数据
        this.addOutContractForm.resetFields();
      },
      submitOutContractEditForm() {
        this.editOutContractForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                outContractId: values.outContractId,
                outContractName: values.outContractName,
                outCompanyName: values.outCompanyName,
                outContractAmount: values.outContractAmount,
                outPaid: values.outPaid,
                outContractDate: values.outContractDate,
                outContractCategory: values.outContractCategory && {
                  categoryId: values.outContractCategory,
                },
                outProjectCategory: values.outProjectCategory && {
                  categoryId: values.outProjectCategory,
                },
                note: values.note
              };
              this.verifyOutContract(params).then((res) => {
                if (res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.editOutContractForm.resetFields();
                  this.outContractEditVisible = false;
                  this.updateOutContractTableData();
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
      submitOutContractForm() {
        this.addOutContractForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                subProjectId: this.currentSubProjectId,
                outContracts: [{
                  outContractId: values.outContractId,
                  outContractName: values.outContractName,
                  outCompanyName: values.outCompanyName,
                  outContractAmount: values.outContractAmount,
                  outPaid: values.outPaid,
                  outContractDate: values.outContractDate,
                  outContractCategory: values.outContractCategory && {
                    categoryId: values.outContractCategory,
                  },
                  outProjectCategory: values.outProjectCategory && {
                    categoryId: values.outProjectCategory,
                  },
                  note: values.note
                }],
              };
              this.addOutContract(params).then((res) => {
                if (res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.addOutContractForm.resetFields();
                  this.updateOutContractTableData();
                  this.outContractAddVisible = false;
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      }
    }
  }
</script>