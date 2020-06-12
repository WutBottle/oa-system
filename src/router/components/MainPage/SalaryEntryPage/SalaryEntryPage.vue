<style lang="scss" scoped>
  .SalaryEntryPage {
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
  <div class="SalaryEntryPage">
    <HeaderPage title="工资管理"/>
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
                    @search="fetchContracts"
                    @change="handleChange"
                    notFoundContent="无搜索结果"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in contractsData" :key="d.contractId">
                {{d.contractId}}
                <a-divider type="vertical" />
                {{d.contractName}}
              </a-select-option>
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
                         @change="handleTableChange" :scroll="{ y: 450}">
                  <span slot="serial" slot-scope="text, record, index">
                  {{ index + 1 }}
                  </span>
                  <div slot="money" slot-scope="text" style="text-align: right;">
                    {{numToMoney(text)}}
                  </div>
                  <a-tag slot="staffCode" slot-scope="text" color="orange">{{text}}</a-tag>
                  <span slot="operation" slot-scope="text, record">
                    <a @click="handleEdit(record)">修改</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="确定删除？" @confirm="handleDelete(record)" okText="确定" cancelText="取消">
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
                  @click="() => this.addVisible = true"
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
            title="新增工资信息"
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
                label="金额(元)"
        >
          <a-input
                  v-decorator="[
          'money',
          {rules: [{
            required: true, message: '请输入金额!'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入金额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职员名称"
        >
          <a-select
                  v-decorator="[
          'staff',
          {rules: [{ required: true, message: '请选择职员！' }]}
        ]"
                  labelInValue
                  placeholder="请选择职员"
                  showSearch
                  :showArrow="false"
                  :filterOption="false"
                  @search="fetchStaffData"
                  notFoundContent="无该人员数据"
                  :defaultActiveFirstOption="false"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="d in staffData" :key="d.id">{{d.staffName}}
              <a-divider type="vertical"/>
              <a-tag color="orange">{{d.staffCode}}</a-tag>
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
            title="修改工资"
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
                label="工资"
        >
          <a-input
                  v-decorator="[
          'money',
          {initialValue: this.editFormData.money, rules: [{
            required: true, message: '请输入工资!'
          },{
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入工资"
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
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {debounce} from 'debounce';
  import HeaderPage from "../HeaderPage/HeaderPage";
  import numToMoney from "@utils/numToMoney";

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  export default {
    name: "SalaryEntryPage",
    components: {
      HeaderPage,
    },
    data() {
      this.fetchContracts = debounce(this.fetchContracts, 500);
      this.fetchStaffData = debounce(this.fetchStaffData, 500);
      return {
        numToMoney,
        formItemLayout,
        formTailLayout,
        current: 0,
        steps: [{
          title: '选择合同',
          type: 'searchContract',
        }, {
          title: '添加人员工资',
          type: 'addSalary',
        }],
        tableSpinning: false,
        contractValue: undefined,
        contractsData: [],
        fetching: false,
        addVisible: false, // 弹出框控制
        columns: [
          {
            title: '序号',
            width: 70,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          },
          {
            title: '员工名称',
            width: 100,
            dataIndex: 'staffName',
            key: 'staffName',
          },
          {
            title: '员工号',
            width: 100,
            dataIndex: 'staffCode',
            key: 'staffCode',
            scopedSlots: {customRender: 'staffCode'}
          },
          {
            title: '工资',
            width: 100,
            dataIndex: 'money',
            key: 'money',
            sorter: (a, b) => a.money - b.money,
            scopedSlots: {customRender: 'money'}
          },
          {
            title: '备注',
            width: 100,
            dataIndex: 'staffNote',
            key: 'staffNote',
          },
          {
            title: '记录操作',
            width: 120,
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }
        ],
        addForm: this.$form.createForm(this),
        editVisible: false,
        editFormData: {},
        editForm: this.$form.createForm(this),
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.salaryOperation.entryPaginationProps,// 分页控制
        tableData: state => state.salaryOperation.entryTableData, // 列表数据
        contractId: state => state.salaryOperation.contractId, // 合同号
        designId: state => state.salaryOperation.designId, // 设计号
        contractName: state => state.salaryOperation.contractName, // 合同名称
        staffData: state => state.staffOperation.staffData, // 职员信息
      }),
    },
    methods: {
      ...mapActions({
        getContractIdsByIdLike: 'contractList/getContractIdsByIdLike',
        getSalaryListByContractId: 'salaryOperation/getSalaryListByContractId',
        addSalary: 'salaryOperation/addSalary',
        deleteSalary: 'salaryOperation/deleteSalary',
        verifySalary: 'salaryOperation/verifySalary',
        getStaffNamesByNameLike: 'staffOperation/getStaffNamesByNameLike',
      }),
      updateTableData() {
        this.tableSpinning = true;
        const params = {
          contractId: this.contractValue,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize
        };
        this.getSalaryListByContractId(params).then((data) => {
          if (!data.data.data) {
            this.current = 0;
            this.contractValue = undefined;
            this.$message.error(data.data.meta.message);
          }
          this.tableSpinning = false;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      next() {
        this.current++;
        this.updateTableData();
      },
      prev() {
        this.current--
      },
      fetchContracts(value) {
        const params = {
          contractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.data = [];
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
      handleTableChange(paginationProps) {
        this.paginationProps.current = paginationProps.current;
        this.paginationProps.pageSize = paginationProps.pageSize;
        this.updateTableData();
      },
      handleAddClose() {
        // 关闭添加弹窗后还原数据
        this.addForm.resetFields();
      },
      submitForm() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                contract: {
                  contractId: this.contractValue,
                },
                staff: {
                  id: values.staff.key
                },
                money: values.money,
              };
              this.addSalary(params).then((res) => {
                if (res.data.meta.success) {
                  this.addForm.resetFields();
                  this.updateTableData();
                  this.addVisible = false;
                  this.$message.success(res.data.meta.message);
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
      // 处理编辑
      handleEdit(selectData) {
        this.editForm.resetFields();
        this.editFormData = JSON.parse(JSON.stringify(selectData));
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
                id: this.editFormData.id,
                money: values.money,
              };
              this.verifySalary(params).then((res) => {
                if (res.data.meta.success){
                  this.$message.success('修改成功');
                  this.updateTableData();
                  this.editVisible = false;
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
      handleDelete(data) {
        const params = {
          id: data.id,
        };
        this.deleteSalary(params).then((res) => {
          this.updateTableData();
          this.$message.success(res.data.data)
        }).catch((error) => {
          this.$message.error(error);
        })
      },
      fetchStaffData(value) {
        const params = {
          staffName: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getStaffNamesByNameLike(params).then((res) => {
          this.fetching = false;
        });
      }
    }
  }
</script>