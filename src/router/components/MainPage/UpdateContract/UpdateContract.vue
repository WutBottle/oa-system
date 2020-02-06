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
                label="合同名称"
        >
          <a-input
                  v-decorator="[
          'contractName',
          {initialValue: this.formData.contractName, rules: [{ required: true, message: '请输入合同名称！' }]}
        ]"
                  placeholder="请输入合同名称"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="发包人合同编号"
        >
          <a-input
                  v-decorator="[
          'ownerId',
          {initialValue: this.formData.employerContractNum, rules: [{
            required: true, message: '请输入发包人合同编号！'
          }]}
        ]"
                  placeholder="请输入发包人合同编号"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="设计号"
        >
          <a-input
                  v-decorator="[
          'designId',
          {initialValue: this.formData.designNum, rules: [{ required: true, message: '请输入设计号！' }]}
        ]"
                  placeholder="请输入设计号"
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
            required: true, message: '请输入合同额！'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
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
        rules: [{ type: 'object', required: true, message: '请选择实际签约日期!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="合同归档日期"
        >
          <a-date-picker
                  v-decorator="['contractDate',  {
                    initialValue: this.formData.contractFilingDate,
        rules: [{ type: 'object', required: true, message: '请选择合同归档日期!' }],
      }]"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="主设计部门"
        >
          <a-input
                  v-decorator="[
          'departmentDesign',
          {initialValue: this.formData.mainDesignDepartment, rules: [{ required: true, message: '请输入主设计部门！' }]}
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
          {initialValue: this.formData.managementDepartment, rules: [{ required: true, message: '请输入经营部门！' }]}
        ]"
                  placeholder="请输入经营部门"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="经营经理"
        >
          <a-input
                  v-decorator="[
          'runningManager',
          {initialValue: this.formData.runningManager, rules: [{ required: true, message: '请输入经营经理！' }]}
        ]"
                  placeholder="请输入经营经理"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目经理"
        >
          <a-input
                  v-decorator="[
          'projectManager',
          {initialValue: this.formData.projectManager, rules: [{ required: true, message: '请输入项目经理！' }]}
        ]"
                  placeholder="请输入项目经理"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目预算秘书"
        >
          <a-input
                  v-decorator="[
          'projectSecretary',
          {initialValue: this.formData.projectSecretary, rules: [{ required: true, message: '请输入项目预算秘书！' }]}
        ]"
                  placeholder="请输入项目预算秘书"
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
          {initialValue: this.formData.contractingParty, rules: [{ required: true, message: '请输入发包方！' }]}
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
            required: true, message: '请输入投资额！'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入投资额"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目规模(平方米)"
        >
          <a-input
                  v-decorator="[
          'scale',
          {initialValue: this.formData.projectScale, rules: [{
            required: true, message: '请输入项目规模！'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
          }]}
        ]"
                  placeholder="请输入项目规模"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="地区关键词"
        >
          <a-input
                  v-decorator="[
          'district',
          {initialValue: this.formData.regionalKeyWords, rules: [{ required: true, message: '请输入地区关键词！' }]}
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
          {initialValue: this.formData.class1, rules: [{ required: true, message: '请输入建筑一级分类！' }]}
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
          {initialValue: this.formData.class2, rules: [{ required: true, message: '请输入建筑二级分类！' }]}
        ]"
                  placeholder="请输入建筑二级分类"
          />
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="签约状态"
        >
          <a-select
                  v-decorator="[
          'sign',
          {initialValue: String(this.formData.signState), rules: [{ required: true, message: '请选择签约状态！' }]}
        ]"
                  placeholder="请选择签约状态"
          >
            <a-select-option value="true">
              已签约
            </a-select-option>
            <a-select-option value="false">
              未签约
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="地域"
        >
          <a-select
                  v-decorator="[
          'region',
          {initialValue: String(this.formData.region === '省内'), rules: [{ required: true, message: '请选择地域！' }]}
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
                label="是否EPC项目"
        >
          <a-select
                  v-decorator="[
          'epc',
          {initialValue: String(this.formData.epc), rules: [{ required: true, message: '请选择是否EPC项目！' }]}
        ]"
                  placeholder="请选择是否EPC项目"
          >
            <a-select-option value="true">
              是
            </a-select-option>
            <a-select-option value="false">
              否
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="项目类型"
        >
          <a-select
                  v-decorator="[
          'projectCategoryId',
          {initialValue: this.formData.itemCategory, rules: [{ required: true, message: '请选择项目类型！' }]}
        ]"
                  placeholder="请选择项目类型"
          >
            <template v-for="item in this.projectCategoryList">
              <a-select-option :key="item.projectCategoryId" :value="item.projectCategoryId">
                {{item.projectCategoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="合同节点"
        >
          <a-select
                  v-decorator="[
          'contractNodes',
          {initialValue: this.formData.contractNodes, rules: [{ required: true, message: '请输入合同节点！' }]}
        ]"
                  mode="tags"
                  placeholder="请输入合同节点"
          >
            <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">{{(i + 9).toString(36) + i}}
            </a-select-option>
          </a-select>
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
    name: "updateContract",
    props: {
      formData: {
        type: Object,
        default: () => {}
      },
      projectCategoryList: {
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
      }
    },
    methods: {
      ...mapActions({
        uploadContract: 'contractList/uploadContract',
        verifyContract: 'contractList/verifyContract',
      }),
      check() {
        this.form.validateFields(
          (err, values) => {
            if (!err) {
              this.spinning = true;
              let projectCategory = {};
              projectCategory = this.projectCategoryList[this.projectCategoryList.findIndex((item) => item.projectCategoryId === values.projectCategoryId)];
              delete values.projectCategoryId;

              let contractNodes = values.contractNodes;
              let tempContractNodes = [];
              delete values.contractNodes;
              contractNodes.forEach((item) => {
                tempContractNodes.push({
                  nodeDescription: item
                })
              });
              values = Object.assign(values, {contractNodes: tempContractNodes});
              values = Object.assign(values, {contractFile: this.fileName});
              values = Object.assign(values, {projectCategory: projectCategory});
              this.verifyContract(values).then((data) => {
                this.spinning = false;
                this.$message.success(data.data.data);
                this.form.resetFields();
                this.$emit('refreshData');
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
      }
    },
  }
</script>


