<style lang="scss" scoped>
  .StaffEntryPage {
    .page-content {
      padding: 24px;

    }
  }
</style>

<template>
  <div class="StaffEntryPage">
    <HeaderPage title="职员管理"/>
    <div class="page-content">
      <div style="background-color: #fff;padding: 24px">
        <a-row style="margin-bottom: 24px">
          <a-form :layout="formLayout">
            <a-form-item
                    label="查询关键词"
            >
              <a-input style="width: 120px" placeholder="姓名、工号" v-model="staffName"/>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleQuery(true)">
                查询
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" icon="search" @click="() => this.queryVisible=true">精确查询</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="showAdd">
                新增
              </a-button>
            </a-form-item>
          </a-form>
        </a-row>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="columns" :dataSource="tableData"
                     :pagination="tablePaginationProps"
                     @change="handleTableChange" :scroll="{ x: 2950, y: 550}">
              <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <template slot="operation" slot-scope="text, record">
                <a @click="handleEdit(record)">修改</a>
                <a-divider type="vertical"/>
                <a-popconfirm title="确定删除？" @confirm="handleDelete(record)" okText="确定" cancelText="取消">
                  <a>删除</a>
                </a-popconfirm>
              </template>
            </a-table>
          </a-spin>
        </div>
      </div>
    </div>
    <a-modal
            title="新增职员"
            v-model="addVisible"
            @ok="submitForm"
            okText="提交"
            cancelText="取消"
            :afterClose="handleAddClose"
            :maskClosable="false"
            width="600px"
    >
      <a-form
              :form="addForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="工号"
        >
          <a-input
                  v-decorator="[
          'staffCode',
          {rules: [{
            required: true, message: '请输入工号!'
          }]}
        ]"
                  placeholder="请输入工号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="姓名"
        >
          <a-input
                  v-decorator="[
          'staffName',
          {rules: [{
            required: true, message: '请输入姓名!'
          }]}
        ]"
                  placeholder="请输入姓名"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="学历"
        >
          <a-select
                  v-decorator="[
          'degree',
        ]"
                  placeholder="请选择学历"
          >
            <a-select-option value="专科">专科</a-select-option>
            <a-select-option value="本科">本科</a-select-option>
            <a-select-option value="硕士研究生">硕士研究生</a-select-option>
            <a-select-option value="博士研究生">博士研究生</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="民族"
        >
          <a-select
                  v-decorator="[
          'nation',
        ]"
                  placeholder="请选择民族"
          >
            <a-select-option v-for="item in nationList" :value="item" :key="item">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="政治面貌"
        >
          <a-select
                  v-decorator="[
          'politic',
        ]"
                  placeholder="请选择政治面貌"
          >
            <a-select-option value="中共党员">中共党员</a-select-option>
            <a-select-option value="中共预备党员">中共预备党员</a-select-option>
            <a-select-option value="共青团员">共青团员</a-select-option>
            <a-select-option value="群众">群众</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="出生日期"
        >
          <a-date-picker
                  v-decorator="['dob',  {
      }]"
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="参加工作日期"
        >
          <a-date-picker
                  v-decorator="['participation']"
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="进入系统日期"
        >
          <a-date-picker
                  v-decorator="['workDate']"
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="第一学历学校"
        >
          <a-input
                  v-decorator="[
          'firstEducation'
          ]"
                  placeholder="请输入第一学历学校"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="第二学历学校"
        >
          <a-input
                  v-decorator="[
          'secondEducation'
          ]"
                  placeholder="请输入第二学历学校"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="专业"
        >
          <a-input
                  v-decorator="[
          'major'
          ]"
                  placeholder="请输入专业"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="部门"
        >
          <a-select
                  v-decorator="[
          'department',
        ]"
                  placeholder="请选择部门"
          >
            <template v-for="option in departmentList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="人员类别"
        >
          <a-select
                  v-decorator="[
          'staffClass',
        ]"
                  placeholder="请选择人员类别"
          >
            <template v-for="option in staffClassList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职级"
        >
          <a-select
                  v-decorator="[
          'rank',
        ]"
                  placeholder="请选择职级"
          >
            <template v-for="option in rankList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="专业技术资格名称"
        >
          <a-input
                  v-decorator="[
          'techQualification',
        ]"
                  placeholder="请输入专业技术资格名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="执业注册资格名称"
        >
          <a-input
                  v-decorator="[
          'proQualification',
        ]"
                  placeholder="请输入执业注册资格名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职务"
        >
          <a-select
                  v-decorator="[
          'duty',
        ]"
                  placeholder="请选择职务"
          >
            <template v-for="option in dutyList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="证件号码"
        >
          <a-input
                  v-decorator="[
          'idNumber',
        ]"
                  placeholder="请输入证件号码"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="性别"
        >
          <a-select
                  v-decorator="[
          'gender',
        ]"
                  placeholder="请选择性别"
          >
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="岗位"
        >
          <a-select
                  v-decorator="[
          'job',
        ]"
                  placeholder="请选择岗位"
          >
            <template v-for="option in jobList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
            title="修改职员信息"
            placement="right"
            :closable="false"
            width="560"
            @close="onEditClose"
            :visible="editVisible"
    >
      <a-form
              :form="editForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="工号"
        >
          <a-input
                  disabled
                  v-decorator="[
          'staffCode',
          {initialValue: this.editFormData.staffCode, rules: [{
            required: true, message: '请输入工号!'
          }]}
        ]"
                  placeholder="请输入工号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="姓名"
        >
          <a-input
                  v-decorator="[
          'staffName',
          {initialValue: this.editFormData.staffName, rules: [{
            required: true, message: '请输入姓名!'
          }]}
        ]"
                  placeholder="请输入姓名"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="学历"
        >
          <a-select
                  v-decorator="[
          'degree',
          {initialValue: this.editFormData.degree}
        ]"
                  placeholder="请选择学历"
          >
            <a-select-option value="专科">专科</a-select-option>
            <a-select-option value="本科">本科</a-select-option>
            <a-select-option value="硕士研究生">硕士研究生</a-select-option>
            <a-select-option value="博士研究生">博士研究生</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="民族"
        >
          <a-select
                  v-decorator="[
          'nation',
          {initialValue: this.editFormData.nation}
        ]"
                  placeholder="请选择民族"
          >
            <a-select-option v-for="item in nationList" :value="item" :key="item">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="政治面貌"
        >
          <a-select
                  v-decorator="[
          'politic',
          {initialValue: this.editFormData.politic}
        ]"
                  placeholder="请选择政治面貌"
          >
            <a-select-option value="中共党员">中共党员</a-select-option>
            <a-select-option value="中共预备党员">中共预备党员</a-select-option>
            <a-select-option value="共青团员">共青团员</a-select-option>
            <a-select-option value="群众">群众</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="出生日期"
        >
          <a-date-picker
                  v-decorator="['dob',  {initialValue: this.editFormData.dob}]"
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="参加工作日期"
        >
          <a-date-picker
                  v-decorator="['participation', {initialValue: this.editFormData.participation}]"
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="进入系统日期"
        >
          <a-date-picker
                  v-decorator="['workDate', {initialValue: this.editFormData.workDate}]"
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="第一学历学校"
        >
          <a-input
                  v-decorator="[
          'firstEducation', {initialValue: this.editFormData.firstEducation}]"
                  placeholder="请输入第一学历学校"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="第二学历学校"
        >
          <a-input
                  v-decorator="[
          'secondEducation', {initialValue: this.editFormData.secondEducation}]"
                  placeholder="请输入第二学历学校"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="专业"
        >
          <a-input
                  v-decorator="[
          'major', {initialValue: this.editFormData.major}]"
                  placeholder="请输入专业"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="部门"
        >
          <a-select
                  v-decorator="[
          'department',
          {initialValue: this.editFormData.departmentId}
        ]"
                  placeholder="请选择部门"
          >
            <template v-for="option in departmentList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="人员类别"
        >
          <a-select
                  v-decorator="[
          'staffClass',
          {initialValue: this.editFormData.staffClassId}
        ]"
                  placeholder="请选择人员类别"
          >
            <template v-for="option in staffClassList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职级"
        >
          <a-select
                  v-decorator="[
          'rank',
          {initialValue: this.editFormData.rankId}
        ]"
                  placeholder="请选择职级"
          >
            <template v-for="option in rankList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="专业技术资格名称"
        >
          <a-input
                  v-decorator="[
          'techQualification',{initialValue: this.editFormData.techQualification}
        ]"
                  placeholder="请输入专业技术资格名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="执业注册资格名称"
        >
          <a-input
                  v-decorator="[
          'proQualification',{initialValue: this.editFormData.proQualification}
        ]"
                  placeholder="请输入执业注册资格名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职务"
        >
          <a-select
                  v-decorator="[
          'duty',
          {initialValue: this.editFormData.dutyId}
        ]"
                  placeholder="请选择职务"
          >
            <template v-for="option in dutyList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="证件号码"
        >
          <a-input
                  v-decorator="[
          'idNumber',
          {initialValue: this.editFormData.idNumber}
        ]"
                  placeholder="请输入证件号码"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="性别"
        >
          <a-select
                  v-decorator="[
          'gender',
          {initialValue: this.editFormData.gender}
        ]"
                  placeholder="请选择性别"
          >
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="岗位"
        >
          <a-select
                  v-decorator="[
          'job',
          {initialValue: this.editFormData.jobId}
        ]"
                  placeholder="请选择岗位"
          >
            <template v-for="option in jobList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
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
    <a-drawer
            title="筛选条件"
            placement="right"
            :closable="false"
            @close="() => this.queryVisible = false"
            :visible="queryVisible"
            width="500"
    >
      <a-form formLayout="horizontal">
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="年龄"
        >
          <a-input-number :min="0" :max="Infinity" v-model="ageLowerBound"
                          @blur="onChange('ageLowerBound','ageUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="ageUpperBound"
                          @blur="onChange('ageLowerBound','ageUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="性别"
        >
          <a-select
                  :allowClear="true"
                  v-model="gender"
                  placeholder="请选择性别"
          >
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="政治面貌"
        >
          <a-select
                  :allowClear="true"
                  v-model="politic"
                  placeholder="请选择政治面貌"
          >
            <a-select-option value="中共党员">中共党员</a-select-option>
            <a-select-option value="中共预备党员">中共预备党员</a-select-option>
            <a-select-option value="共青团员">共青团员</a-select-option>
            <a-select-option value="群众">群众</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="民族"
        >
          <a-select
                  :allowClear="true"
                  v-model="nation"
                  placeholder="请选择民族"
          >
            <a-select-option v-for="item in nationList" :value="item" :key="item">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="岗位"
        >
          <a-select
                  :allowClear="true"
                  v-model="job"
                  placeholder="请选择岗位"
          >
            <template v-for="option in jobList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="部门"
        >
          <a-select
                  :allowClear="true"
                  v-model="department"
                  placeholder="请选择部门"
          >
            <template v-for="option in departmentList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="人员类别"
        >
          <a-select
                  :allowClear="true"
                  v-model="staffClass"
                  placeholder="请选择人员类别"
          >
            <template v-for="option in staffClassList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="职级"
        >
          <a-select
                  :allowClear="true"
                  v-model="rank"
                  placeholder="请选择职级"
          >
            <template v-for="option in rankList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="学历"
        >
          <a-select
                  :allowClear="true"
                  v-model="degree"
                  placeholder="学历"
          >
            <a-select-option value="专科">专科</a-select-option>
            <a-select-option value="本科">本科</a-select-option>
            <a-select-option value="硕士研究生">硕士研究生</a-select-option>
            <a-select-option value="博士研究生">博士研究生</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="职务"
        >
          <a-select
                  :allowClear="true"
                  v-model="duty"
                  placeholder="请选择职级"
          >
            <template v-for="option in dutyList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="参加工作日期"
        >
          <a-range-picker style="width: 220px;" v-model="participationDate"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="进入系统日期"
        >
          <a-range-picker style="width: 220px;" v-model="workDateSearchDate"/>
        </a-form-item>
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <a-button type="primary" @click="handleQuery(false)">
            查找
          </a-button>
          <a-button style="margin-left: 16px" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";
  import moment from "moment";

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  export default {
    name: "StaffEntryPage",
    components: {
      HeaderPage
    },
    computed: {
      ...mapState({
        departmentList: state => state.categoryOperation.departmentList,
        staffClassList: state => state.categoryOperation.classificationList,
        rankList: state => state.categoryOperation.rankList,
        dutyList: state => state.categoryOperation.dutyList,
        jobList: state => state.categoryOperation.jobList,
      })
    },
    data() {
      return {
        formLayout: 'inline',
        formItemLayout,
        formTailLayout,
        staffName: '', // 查询的职员名
        addVisible: false,
        addForm: this.$form.createForm(this),
        editVisible: false, // 编辑控制页面
        editFormData: {}, // 编辑当前表单数据
        editForm: this.$form.createForm(this),
        currentStaffId: '', // 当前编辑的用户id
        spinning: false,
        tablePaginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40', '100'], // 每页数量选项
          total: 0,
          current: 1,
        },
        tableData: [],
        columns: [
          {
            title: '序号',
            width: 70,
            fixed: 'left',
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          }, {
            title: '工号',
            width: 100,
            fixed: 'left',
            dataIndex: 'staffCode',
            key: 'staffCode',
          }, {
            title: '姓名',
            width: 100,
            fixed: 'left',
            dataIndex: 'staffName',
            key: 'staffName',
          }, {
            title: '部门',
            width: 120,
            dataIndex: 'department',
            key: 'department',
          }, {
            title: '人员类别',
            width: 120,
            dataIndex: 'staffClass',
            key: 'staffClass',
          }, {
            title: '职级',
            width: 100,
            dataIndex: 'rank',
            key: 'rank',
          }, {
            title: '学历',
            width: 120,
            dataIndex: 'degree',
            key: 'degree',
          }, {
            title: '专业技术资格名称',
            width: 180,
            dataIndex: 'techQualification',
            key: 'techQualification',
          }, {
            title: '执业注册资格名称',
            width: 180,
            dataIndex: 'proQualification',
            key: 'proQualification',
          }, {
            title: '职务',
            width: 100,
            dataIndex: 'duty',
            key: 'duty',
          }, {
            title: '证件号码',
            width: 200,
            dataIndex: 'idNumber',
            key: 'idNumber',
          }, {
            title: '性别',
            width: 100,
            dataIndex: 'gender',
            key: 'gender',
          }, {
            title: '民族',
            width: 100,
            dataIndex: 'nation',
            key: 'nation',
          }, {
            title: '岗位',
            width: 150,
            dataIndex: 'job',
            key: 'job',
          }, {
            title: '政治面貌',
            width: 100,
            dataIndex: 'politic',
            key: 'politic',
          }, {
            title: '出生日期',
            width: 150,
            dataIndex: 'dob',
            key: 'dob',
            sorter: (a, b) => new Date(a.dob) - new Date(b.dob),
          }, {
            title: '年龄',
            width: 100,
            dataIndex: 'age',
            key: 'age',
            sorter: (a, b) => a.age - b.age,
          }, {
            title: '参加工作日期',
            width: 150,
            dataIndex: 'participation',
            key: 'participation',
            sorter: (a, b) => new Date(a.participation) - new Date(b.participation),
          }, {
            title: '进入系统日期',
            width: 150,
            dataIndex: 'workDate',
            key: 'workDate',
            sorter: (a, b) => new Date(a.workDate) - new Date(b.workDate),
          }, {
            title: '第一学历学校',
            width: 150,
            dataIndex: 'firstEducation',
            key: 'firstEducation',
          }, {
            title: '第二学历学校',
            width: 150,
            dataIndex: 'secondEducation',
            key: 'secondEducation',
          }, {
            title: '专业',
            width: 150,
            dataIndex: 'major',
            key: 'major',
          }, {
            title: '编辑操作',
            width: 120,
            fixed: 'right',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          }
        ],
        nationList: [
          "汉族",
          "壮族",
          "满族",
          "回族",
          "苗族",
          "维吾尔族",
          "土家族",
          "彝族",
          "蒙古族",
          "藏族",
          "布依族",
          "侗族",
          "瑶族",
          "朝鲜族",
          "白族",
          "哈尼族",
          "哈萨克族",
          "黎族",
          "傣族",
          "畲族",
          "傈僳族",
          "仡佬族",
          "东乡族",
          "高山族",
          "拉祜族",
          "水族",
          "佤族",
          "纳西族",
          "羌族",
          "土族",
          "仫佬族",
          "锡伯族",
          "柯尔克孜族",
          "达斡尔族",
          "景颇族",
          "毛南族",
          "撒拉族",
          "布朗族",
          "塔吉克族",
          "阿昌族",
          "普米族",
          "鄂温克族",
          "怒族",
          "京族",
          "基诺族",
          "德昂族",
          "保安族",
          "俄罗斯族",
          "裕固族",
          "乌孜别克族",
          "门巴族",
          "鄂伦春族",
          "独龙族",
          "塔塔尔族",
          "赫哲族",
          "珞巴族",
          "其他"
        ],
        queryVisible: false,
        ageLowerBound: null,
        ageUpperBound: null,
        gender: undefined,
        politic: undefined,
        nation: undefined,
        job: undefined,
        department: undefined,
        staffClass: undefined,
        rank: undefined,
        degree: undefined,
        duty: undefined,
        participationDate: [],
        workDateSearchDate: [],
      }
    },
    mounted() {
      this.updateTableData();
    },
    methods: {
      ...mapActions({
        addStaff: 'staffOperation/addStaff',
        getStaffListByNameLikeTable: 'staffOperation/getStaffListByNameLikeTable',
        deleteStaff: 'staffOperation/deleteStaff',
        verifyStaff: 'staffOperation/verifyStaff',
      }),
      handleTableChange(pagination) {
        this.tablePaginationProps.current = pagination.current;
        this.tablePaginationProps.pageSize = pagination.pageSize;
        this.updateTableData();
      },
      updateTableData() {
        this.spinning = true;
        let participation, workDate;
        if (this.participationDate.length) {
          participation = [moment(this.participationDate[0]).format('YYYY-MM-DD'), moment(this.participationDate[1]).format('YYYY-MM-DD')]
        } else {
          participation = ['', '']
        }
        if (this.workDateSearchDate.length) {
          workDate = [moment(this.workDateSearchDate[0]).format('YYYY-MM-DD'), moment(this.workDateSearchDate[1]).format('YYYY-MM-DD')]
        } else {
          workDate = ['', '']
        }
        const params = {
          staffName: this.staffName,
          participation: participation,
          workDate: workDate,
          age: [this.ageLowerBound ? String(this.ageLowerBound) : '', this.ageUpperBound ? String(this.ageUpperBound) : ''],
          gender: this.gender,
          politic: this.politic,
          nation: this.nation,
          jobId: this.job,
          departmentId: this.department,
          staffClassId: this.staffClass,
          rankId: this.rank,
          degree: this.degree,
          dutyId: this.duty,
          pageNum: this.tablePaginationProps.current,
          pageLimit: this.tablePaginationProps.pageSize
        };
        this.getStaffListByNameLikeTable(params).then((res) => {
          if (res && res.data.meta.success) {
            this.tablePaginationProps.total = res.data.data.totalElements;
            this.tableData = res.data.data.content.map((item, index) => {
              return {
                key: index,
                id: item.id,
                age: item.dob && moment().diff(item.dob, 'years'),
                workDate: item.workDate && moment(item.workDate).format('YYYY-MM-DD'),
                staffCode: item.staffCode,
                staffName: item.staffName,
                staffClass: item.staffClass && item.staffClass.categoryName,
                staffClassId: item.staffClass ? item.staffClass.categoryId : undefined,
                degree: item.degree ? item.degree : undefined,
                department: item.department && item.department.categoryName,
                departmentId: item.department ? item.department.categoryId : undefined,
                dob: item.dob && moment(item.dob).format('YYYY-MM-DD'),
                duty: item.duty && item.duty.categoryName,
                dutyId: item.duty ? item.duty.categoryId : undefined,
                firstEducation: item.firstEducation,
                gender: item.gender ? item.gender : undefined,
                idNumber: item.idNumber,
                job: item.job && item.job.categoryName,
                jobId: item.job ? item.job.categoryId : undefined,
                major: item.major,
                nation: item.nation ? item.nation : undefined,
                participation: item.participation && moment(item.participation).format('YYYY-MM-DD'),
                proQualification: item.proQualification,
                rank: item.rank && item.rank.categoryName,
                rankId: item.rank ? item.rank.categoryId : undefined,
                secondEducation: item.secondEducation,
                techQualification: item.techQualification,
                politic: item.politic ? item.politic : undefined,
              }
            });
          } else {
            this.$message.error('服务器错误')
          }
          this.spinning = false;
        }).catch((error) => {
          this.spinning = false;
          this.$message.error(error);
        });
      },
      // 处理查询
      handleQuery(isReset) {
        if (isReset) {
          this.handleReset();
        }
        this.tablePaginationProps.current = 1;
        this.updateTableData();
      },
      showAdd() {
        this.addVisible = true;
      },
      submitForm() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                staffCode: values.staffCode,
                staffName: values.staffName,
                department: values.department ? {
                  categoryId: values.department
                } : null,
                staffClass: values.staffClass ? {
                  categoryId: values.staffClass
                } : null,
                job: values.job ? {
                  categoryId: values.job,
                } : null,
                duty: values.duty ? {
                  categoryId: values.duty,
                } : null,
                rank: values.rank ? {
                  categoryId: values.rank,
                } : null,
                degree: values.degree,
                proQualification: values.proQualification,
                techQualification: values.techQualification,
                idNumber: values.idNumber,
                gender: values.gender,
                nation: values.nation,
                politic: values.politic,
                dob: values.dob,
                participation: values.participation,
                workDate: values.workDate,
                firstEducation: values.firstEducation,
                secondEducation: values.secondEducation,
                major: values.major
              };
              this.addStaff(params).then(res => {
                if (res.data.meta.success) {
                  this.$message.success('添加成功');
                  this.addVisible = false;
                  this.addForm.resetFields();
                  this.updateTableData();
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch(error => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      handleAddClose() {
        this.addVisible = false;
        this.addForm.resetFields();
      },
      // 关闭修改弹窗
      onEditClose() {
        this.editVisible = false;
      },
      handleEdit(selectData) {
        this.editFormData = JSON.parse(JSON.stringify(selectData));
        this.editFormData.dob = this.editFormData.dob ? moment(this.editFormData.dob) : undefined;
        this.editFormData.participation = this.editFormData.participation ? moment(this.editFormData.participation) : undefined;
        this.editFormData.workDate = this.editFormData.workDate ? moment(this.editFormData.workDate) : undefined;
        this.currentStaffId = selectData.id;
        this.editForm.resetFields();
        this.editVisible = true;
      },
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                id: this.currentStaffId,
                staffCode: values.staffCode,
                staffName: values.staffName,
                department: values.department ? {
                  categoryId: values.department
                } : null,
                staffClass: values.staffClass ? {
                  categoryId: values.staffClass
                } : null,
                job: values.job ? {
                  categoryId: values.job,
                } : null,
                duty: values.duty ? {
                  categoryId: values.duty,
                } : null,
                rank: values.rank ? {
                  categoryId: values.rank,
                } : null,
                degree: values.degree,
                proQualification: values.proQualification,
                techQualification: values.techQualification,
                idNumber: values.idNumber,
                gender: values.gender,
                nation: values.nation,
                politic: values.politic,
                dob: values.dob,
                participation: values.participation,
                firstEducation: values.firstEducation,
                secondEducation: values.secondEducation,
                major: values.major
              };
              this.verifyStaff(params).then((res) => {
                if (res.data.meta.success) {
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
      handleFinalDelete() {
        const finalPage = Math.ceil(this.tablePaginationProps.total / this.tablePaginationProps.pageSize);
        if (this.tableData.length === 1 && this.tablePaginationProps.current != 1 && this.tablePaginationProps.current === finalPage) {
          this.tablePaginationProps.current--;
        }
      },
      handleDelete(data) {
        const params = {
          id: data.id
        };
        this.deleteStaff(params).then(res => {
          if (res.data.meta.success) {
            this.handleFinalDelete();
            this.updateTableData();
            this.$message.success(res.data.meta.message);
          } else {
            this.$message.error(res.data.meta.message);
          }
        }).catch(error => {
          this.$message.error(error);
        });
      },
      onChange(lowerBound, upperBound) {
        if (this[lowerBound] && this[upperBound] && this[upperBound] < this[lowerBound]) {
          let temp = this[lowerBound];
          this[lowerBound] = this[upperBound];
          this[upperBound] = temp;
        }
      },
      handleReset() {
        Object.assign(this, {
          ageLowerBound: null,
          ageUpperBound: null,
          gender: undefined,
          politic: undefined,
          nation: undefined,
          job: undefined,
          department: undefined,
          staffClass: undefined,
          rank: undefined,
          degree: undefined,
          duty: undefined,
          participationDate: [],
          workDateSearchDate: [],
        })
      },
    }
  }
</script>