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
                label="设计号"
        >
          <a-input
                  disabled
                  v-decorator="[
          'designId',
          {initialValue: this.formData.designNum}
        ]"
                  placeholder="请输入设计号"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="合同号"
        >
          <a-input
                  disabled
                  v-decorator="[
          'contractId',
          {initialValue: this.formData.contractNum, rules: [{
            required: true, message: '请输入合同号！'
          }]}
        ]"
                  placeholder="请输入合同号"
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
          {initialValue: String(this.formData.signState)}
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
                label="发包人合同编号"
        >
          <a-input
                  v-decorator="[
          'ownerId',
          {initialValue: this.formData.employerContractNum}
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
          {initialValue: this.formData.contractName}
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
          {initialValue: this.formData.mainDesignDepartment}
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
          {initialValue: this.formData.managementDepartment}
        ]"
                  placeholder="请输入经营部门"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目经理"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="[
          'projectManager',
          {initialValue: this.formData.projectManager}
        ]"
                  placeholder="请选择项目经理"
          >
            <a-select-option v-for="d in projectManagerList" :key="d.userId">{{d.username}}<a-divider type="vertical" /><a-tag color="orange">{{d.nickname}}</a-tag></a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="行政专员"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="[
          'projectSecretary',
          {initialValue: this.formData.projectSecretary}
        ]"
                  placeholder="请选择项目经理"
          >
            <a-select-option v-for="d in projectSecretaryList" :key="d.userId">{{d.username}}<a-divider type="vertical" /><a-tag color="orange">{{d.nickname}}</a-tag></a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="经营负责人"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="[
          'runningManager',
          {initialValue: this.formData.runningManager}
        ]"
                  placeholder="请选择经营负责人"
          >
            <a-select-option v-for="d in runningManagerList" :key="d.userId">{{d.username}}<a-divider type="vertical" /><a-tag color="orange">{{d.nickname}}</a-tag></a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="总监"
                v-if="!this.formData.sup"
        >
          <a-select
                  v-decorator="[
          'inspector',
          {initialValue: this.formData.inspector}
        ]"
                  placeholder="请选择经营负责人"
          >
            <a-select-option v-for="d in inspectorList" :key="d.userId">{{d.username}}<a-divider type="vertical" /><a-tag color="orange">{{d.nickname}}</a-tag></a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="发包方"
        >
          <a-input
                  v-decorator="[
          'owner',
          {initialValue: this.formData.contractingParty}
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
          {initialValue: this.formData.regionalKeyWords}
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
          {initialValue: this.formData.class1}
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
          {initialValue: this.formData.class2}
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
          {initialValue: !this.formData.epc ? undefined : String(this.formData.epc)}
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
          {initialValue: this.formData.note}
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
  import {mapState, mapActions} from 'vuex'

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
        default: () => {}
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
        projectManagerList: [], // 项目经理列表
        projectSecretaryList: [], // 行政专员列表
        inspectorList: [], // 总监列表
        runningManagerList: [], // 经营负责人列表
      }
    },
    computed: {
      ...mapState({
        staffData: state => state.staffOperation.staffData, // 职员信息
      }),
    },
    mounted() {
      this.getUserListByRoleId({
        roleId: 5, // 项目经理
      }).then(res => {
        this.projectManagerList = res.data.data;
      });
      this.getUserListByRoleId({
        roleId: 4, // 行政专员
      }).then(res => {
        this.projectSecretaryList = res.data.data;
      });
      this.getUserListByRoleId({
        roleId: 2, // 总监
      }).then(res => {
        this.inspectorList = res.data.data;
      });
      this.getUserListByRoleId({
        roleId: 3, // 经营负责人
      }).then(res => {
        this.runningManagerList = res.data.data;
      });
    },
    methods: {
      ...mapActions({
        uploadContract: 'contractList/uploadContract',
        verifyContract: 'contractList/verifyContract',
        getUserListByRoleId: 'userOperation/getUserListByRoleId', // 获取不同角色列表
      }),
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


