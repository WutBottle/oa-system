<style lang="scss" scoped>
  .UpdateContract {

  }
</style>

<template>
  <div class="UpdateContract">
    <a-spin :spinning="spinning">
      <a-form :form="form">
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="合同号"
        >
          <a-input
                  :disabled="this.formData.signState === 0"
                  v-decorator="[
          'contractId',
          {initialValue: this.formData.contractNum, rules: [{
            required: true, message: '请输入合同号！'
          }, {
            type: 'number',
            message: '请输入数字',
            transform:(value)=> {
              if(value){
                return Number(value);
              }
            }
          }, {
            validator: (rule, value, callback) => {
              if (value.toString().length !== 7) {
                callback('请输入格式为2019001的合同号')
              }
              callback()
            }
          }]}
        ]"
                  placeholder="请输入合同号"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="设计号"
        >
          <a-input
                  :disabled="this.formData.signState === 0"
                  v-decorator="[
          'designId',
          {initialValue: this.formData.designNum,
          rules: [{validator: (rule, value, callback) => {
          const pattern =  new RegExp(/^(\d{4})(-)(\d{2})(-)(\d{3})$/)
          if (!pattern.test(value) && value ) {
            callback('请输入此格式数据:2019-01-001')
          }
          callback()
          }}, {max: 14, message: '不得超过14个字符'}]}
        ]"
                  placeholder="请输入设计号"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="签约状态"
        >
          <a-select
                  v-decorator="[
          'isSign',
          {initialValue: this.formData.signState >= 0 ? String(this.formData.signState) : undefined}
        ]"
                  placeholder="请选择签约状态"
          >
            <a-select-option value="0">
              已签
            </a-select-option>
            <a-select-option value="1">
              洽谈
            </a-select-option>
            <a-select-option value="2">
              投标
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目经理"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="['projectManager',
                  {initialValue: this.formData.projectManager}]"
                  showSearch
                  placeholder="搜索用户"
                  :showArrow="false"
                  style="width: 300px"
                  :filterOption="false"
                  @search="(val) => {this.fetchUsers(val, false)}"
                  notFoundContent="无搜索结果"
                  :defaultActiveFirstOption="false"
                  :allowClear="true"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <template v-for="(d,index) in usersData">
              <a-select-option v-if="d.role && d.role === '普通用户'" :key="d.userId">{{d.username}}
                <a-divider type="vertical"/>
                <a-tag color="orange">{{d.nickname}}</a-tag>
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="商务专员"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="['projectSecretary',
                  {initialValue: this.formData.projectSecretary}]"
                  showSearch
                  placeholder="搜索用户"
                  :showArrow="false"
                  style="width: 300px"
                  :filterOption="false"
                  @search="(val) => {this.fetchUsers(val, false)}"
                  notFoundContent="无搜索结果"
                  :defaultActiveFirstOption="false"
                  :allowClear="true"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <template v-for="(d,index) in usersData">
              <a-select-option v-if="d.role && d.role === '普通用户'" :key="d.userId">{{d.username}}
                <a-divider type="vertical"/>
                <a-tag color="orange">{{d.nickname}}</a-tag>
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="财务专员"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="['financeManager',
                  {initialValue: this.formData.financeManager}]"
                  showSearch
                  placeholder="搜索用户"
                  :showArrow="false"
                  style="width: 300px"
                  :filterOption="false"
                  @search="(val) => {this.fetchUsers(val, false)}"
                  notFoundContent="无搜索结果"
                  :defaultActiveFirstOption="false"
                  :allowClear="true"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <template v-for="(d,index) in usersData">
              <a-select-option v-if="d.role && d.role === '普通用户'" :key="d.userId">{{d.username}}
                <a-divider type="vertical"/>
                <a-tag color="orange">{{d.nickname}}</a-tag>
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目经营负责人"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="['runningManager',
                  {initialValue: this.formData.runningManager}]"
                  showSearch
                  placeholder="搜索用户"
                  :showArrow="false"
                  style="width: 300px"
                  :filterOption="false"
                  @search="(val) => {this.fetchUsers(val, false)}"
                  notFoundContent="无搜索结果"
                  :defaultActiveFirstOption="false"
                  :allowClear="true"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <template v-for="(d,index) in usersData">
              <a-select-option v-if="d.role && d.role === '普通用户'" :key="d.userId">{{d.username}}
                <a-divider type="vertical"/>
                <a-tag color="orange">{{d.nickname}}</a-tag>
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="部门经营负责人"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="['inspector',
                  {initialValue: this.formData.inspector}]"
                  showSearch
                  placeholder="搜索用户"
                  :showArrow="false"
                  style="width: 300px"
                  :filterOption="false"
                  @search="(val) => {this.fetchUsers(val, true)}"
                  notFoundContent="无搜索结果"
                  :defaultActiveFirstOption="false"
                  :allowClear="true"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <template v-for="(d,index) in usersData">
              <a-select-option v-if="d.role && d.role === '部门负责人'" :key="d.userId">{{d.username}}
                <a-divider type="vertical"/>
                <a-tag color="red">{{d.nickname}}</a-tag>
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="发包人合同编号"
        >
          <a-input
                  v-decorator="[
          'ownerId',
          {initialValue: this.formData.employerContractNum,
          rules: [{max: 20, message: '不超过20个字符'}]},
        ]"
                  placeholder="请输入发包人合同编号"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="合同名称"
        >
          <a-input
                  v-decorator="[
          'contractName',
          {initialValue: this.formData.contractName, rules: [{max: 100, message: '不能超过100个字'}]}
        ]"
                  placeholder="请输入合同名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="上传合同文件"
        >
          <a-upload
                  v-decorator="['uploadFile', {
          valuePropName: 'uploadFile',
        }]"
                  :fileList="pdfFileList"
                  :beforeUpload="beforeUpload"
                  :remove="handlePdfRemove"
                  :multiple="false"
          >
            <a-button>
              <a-icon type="upload"/>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="合同额(元)"
        >
          <a-input
                  v-decorator="[
          'contractAmount',
          {initialValue: this.formData.contractAmount, rules: [{
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {
                  if(value){
                    return Number(value);
                  }
                }
          }]}
        ]"
                  placeholder="请输入合同额"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="实际签约日期"
        >
          <a-date-picker
                  v-decorator="['actualDate',  {
                    initialValue: this.formData.actualSigningDate,
      }]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="合同归档日期"
        >
          <a-date-picker
                  v-decorator="['contractDate',  {
                    initialValue: this.formData.contractFilingDate,
      }]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目类别"
        >
          <a-select
                  v-decorator="[
          'projectCategoryId',
          {initialValue: this.formData.itemCategory}
        ]"
                  placeholder="请选择项目类别"
          >
            <template v-for="item in this.projectCategoryList">
              <a-select-option :key="item.categoryId" :value="item.categoryId">
                {{item.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="生产阶段"
        >
          <a-select
                  v-decorator="[
          'productionStageId',
          {initialValue: this.formData.productionStage}
        ]"
                  placeholder="请选择生产阶段"
          >
            <template v-for="item in this.productionStageList">
              <a-select-option :key="item.categoryId" :value="item.categoryId">
                {{item.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="主设计部门"
        >
          <a-input
                  v-decorator="[
          'departmentDesign',
          {initialValue: this.formData.mainDesignDepartment, rules: [{max: 30, message: '不得超过30个字符'}]}
        ]"
                  placeholder="请输入主设计部门"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="经营部门"
        >
          <a-input
                  v-decorator="[
          'departmentRunning',
          {initialValue: this.formData.managementDepartment, rules: [{max: 30, message: '不得超过30个字符'}]}
        ]"
                  placeholder="请输入经营部门"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="发包方"
        >
          <a-input
                  v-decorator="[
          'owner',
          {initialValue: this.formData.contractingParty, rules: [{max: 30, message: '不得超过30个字符'}]}
        ]"
                  placeholder="请输入发包方"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="投资额(万元)"
        >
          <a-input
                  v-decorator="[
          'investment',
          {initialValue: this.formData.investmentAmount, rules: [{
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {
                  if(value){
                    return Number(value);
                  }
                }
          }]}
        ]"
                  placeholder="请输入投资额"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="地上面积(平方米)"
        >
          <a-input
                  v-decorator="[
          'aboveGroundArea',
          {initialValue: this.formData.aboveGroundArea, rules: [{
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {
                  if(value){
                    return Number(value);
                  }
                }
          }]}
        ]"
                  placeholder="请输入地上面积"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="地下面积(平方米)"
        >
          <a-input
                  v-decorator="[
          'underGroundArea',
          {initialValue: this.formData.underGroundArea, rules: [{
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {
                  if(value){
                    return Number(value);
                  }
                }
          }]}
        ]"
                  placeholder="请输入地下面积"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="地域"
        >
          <a-select
                  v-decorator="[
          'region',
          {initialValue: String(this.formData.region === '省内')}
        ]"
                  placeholder="请选择地域"
          >
            <a-select-option value="true">
              省内
            </a-select-option>
            <a-select-option value="false">
              省外
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="地区关键词"
        >
          <a-input
                  v-decorator="[
          'district',
          {initialValue: this.formData.regionalKeyWords, rules: [{max: 50, message: '不得超过50个字符'}]}
        ]"
                  placeholder="请输入地区关键词"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="建筑一级分类"
        >
          <a-input
                  v-decorator="[
          'buildOne',
          {initialValue: this.formData.class1, rules: [{max: 30, message: '不得超过30个字符'}]}
        ]"
                  placeholder="请输入建筑一级分类"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="建筑二级分类"
        >
          <a-input
                  v-decorator="[
          'buildTwo',
          {initialValue: this.formData.class2, rules: [{max: 30, message: '不得超过30个字符'}]}
        ]"
                  placeholder="请输入建筑二级分类"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="是否EPC项目"
        >
          <a-select
                  v-decorator="[
          'epc',
          {initialValue: this.formData.epc === null ? undefined : String(this.formData.epc)}
        ]"
                  placeholder="请选择是否EPC项目"
          >
            <a-select-option value='true'>
              是
            </a-select-option>
            <a-select-option value='false'>
              否
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'note',
          {initialValue: this.formData.note, rules: [{max: 250, message: '不得超过250个字符'}]}
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
                  @click="check"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>

  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  export default {
    name: "UpdateContract",
    props: {
      formData: {
        type: Object,
        default: () => {
        }
      },
      projectCategoryList: {
        type: Array,
        default: () => []
      },
      productionStageList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        formItemLayout,
        formTailLayout,
        spinning: false,
        fileName: '',
        form: this.$form.createForm(this),
        pdfFileList: [],
        fetching: false, // 控制拉取列表
        usersData: [],
      }
    },
    watch: {
      formData: {
        immediate: true,
        handler(val) {
          this.usersData = val.currentUserOptions
        }
      }
    },
    methods: {
      ...mapActions({
        uploadContract: 'contractList/uploadContract',
        verifyContract: 'contractList/verifyContract',
        getUserListByNameLike: 'userOperation/getUserListByNameLike', // 获取不同角色列表
      }),
      fetchUsers(value, index) {
        const params = {
          username: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getUserListByNameLike(params).then((res) => {
          this.usersData = [];
          if (index) {
            res.data.data.content.map(item => {
              if (item.roles[0].name === '部门负责人') {
                this.usersData.push({
                  username: item.username,
                  nickname: item.nickname,
                  userId: item.userId,
                  role: item.roles[0].name,
                })
              }
            });
          } else {
            res.data.data.content.map(item => {
              if (item.roles[0].name === '普通用户') {
                this.usersData.push({
                  username: item.username,
                  nickname: item.nickname,
                  userId: item.userId,
                  role: item.roles[0].name,
                })
              }
            });
          }
          this.fetching = false;
        });
      },
      check() {
        this.form.validateFields(
          (err, values) => {
            if (!err) {
              this.spinning = true;
              let projectCategory = {};
              projectCategory = this.projectCategoryList[this.projectCategoryList.findIndex((item) => item.categoryId === values.projectCategoryId)];
              delete values.projectCategoryId;
              let productionStage = {};
              productionStage = this.productionStageList[this.productionStageList.findIndex((item) => item.categoryId === values.productionStageId)];
              delete values.productionStageId;
              values = Object.assign(values, {
                productionStage: productionStage,
                id: this.formData.id,
                sup: this.formData.sup,
                contractFile: this.fileName ? this.fileName : this.formData.currentFile,
                projectCategory: projectCategory
              });
              values.projectManager = values.projectManager && {
                userId: values.projectManager
              };
              values.runningManager = values.runningManager && {
                userId: values.runningManager
              };
              values.financeManager = values.financeManager && {
                userId: values.financeManager
              };
              values.projectSecretary = values.projectSecretary && {
                userId: values.projectSecretary
              };
              values.inspector = values.inspector && {
                userId: values.inspector
              };
              this.verifyContract(values).then((data) => {
                if (data.data.meta.success) {
                  this.spinning = false;
                  this.$message.success(data.data.data);
                  this.form.resetFields();
                  this.$emit('refreshData');
                } else {
                  this.$message.error(data.data.meta.message);
                  this.spinning = false;
                }
              }).catch((error) => {
                this.spinning = false;
                this.$message.error('合同修改失败');
              });
            }
          },
        );
      },
      handlePdfRemove(file) {
        const index = this.pdfFileList.indexOf(file);
        const newFileList = this.pdfFileList.slice();
        newFileList.splice(index, 1);
        this.pdfFileList = newFileList
      },
      beforeUpload(file) {
        this.spinning = true;
        this.handlePdfRemove(file);
        if (file.type === 'application/pdf') {
          const formData = new FormData();
          this.pdfFileList = [...this.pdfFileList, file];
          this.pdfFileList.forEach((file) => {
            formData.append('multipartFiles', file);
          });
          // 手动上传
          this.uploadContract(formData).then((data) => {
            this.spinning = false;
            this.fileName = data.data.data;
            this.$message.success('文件已上传');
          }).catch((error) => {
            this.spinning = false;
            this.$message.error('上传失败');
          });
        } else {
          this.$message.error('只能上传.pdf文件类型');
          this.handlePdfRemove(file);
        }
        return false;
      },
    },
  }
</script>


