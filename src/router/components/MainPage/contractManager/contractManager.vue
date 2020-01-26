<style lang="scss" scoped>
  .ContractManager {
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
      padding: 24px;

      .form-wrapper {
        padding: 24px 0;
      }

      .xls-upload {
        padding: 24px 24px 0 0;
      }
    }
  }
</style>

<template>
  <div class="ContractManager">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>合同录入</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">合同录入</p>
    </div>
    <div class="page-content">
      <a-row style="background-color: #fff">
        <a-col :span="14">
          <div class="form-wrapper">
            <a-form :form="form">
              <a-form-item
                      :label-col="formItemLayout.labelCol"
                      :wrapper-col="formItemLayout.wrapperCol"
                      label="合同号"
              >
                <a-input
                        v-decorator="[
          'contractId',
          {rules: [{ required: true, message: '请输入合同号！' }]}
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
          {rules: [{ required: true, message: '请输入合同名称！' }]}
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
          {rules: [{ required: true, message: '请输入发包人合同编号！' }]}
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
          {rules: [{ required: true, message: '请输入设计号！' }]}
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
          {rules: [{ required: true, message: '请输入合同额！' }]}
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
          {rules: [{ required: true, message: '请输入主设计部门！' }]}
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
          {rules: [{ required: true, message: '请输入经营部门！' }]}
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
          {rules: [{ required: true, message: '请输入经营经理！' }]}
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
          {rules: [{ required: true, message: '请输入项目经理！' }]}
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
          {rules: [{ required: true, message: '请输入项目预算秘书！' }]}
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
          {rules: [{ required: true, message: '请输入发包方！' }]}
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
          {rules: [{ required: true, message: '请输入投资额！' }]}
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
          {rules: [{ required: true, message: '请输入项目规模！' }]}
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
          {rules: [{ required: true, message: '请输入地区关键词！' }]}
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
          {rules: [{ required: true, message: '请输入建筑一级分类！' }]}
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
          {rules: [{ required: true, message: '请输入建筑二级分类！' }]}
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
          {rules: [{ required: true, message: '请选择签约状态！' }]}
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
          {rules: [{ required: true, message: '请选择地域！' }]}
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
          {rules: [{ required: true, message: '请选择是否EPC项目！' }]}
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
          {rules: [{ required: true, message: '请选择项目类型！' }]}
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
          {rules: [{ required: true, message: '请输入合同节点！' }]}
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
          </div>
        </a-col>
        <a-col :span="10">
          <div class="xls-upload">
            <a-affix :offsetTop="120">
              <a-upload-dragger :multiple="false" :fileList="excelFileList" :remove="handleExcelRemove"
                                :beforeUpload="beforeUploadXls">
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox"/>
                </p>
                <p class="ant-upload-text">点击或拖拽文件导入</p>
                <p class="ant-upload-hint">将合同信息的excel文件拖入此处上传录入</p>
              </a-upload-dragger>
            </a-affix>
          </div>
        </a-col>
      </a-row>
    </div>
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
    name: "contractManager",
    data() {
      return {
        formItemLayout,
        formTailLayout,
        form: this.$form.createForm(this),
        fileName: '',
        pdfFileList: [],
        excelFileList: [],
      };
    },
    computed: {
      ...mapState({
        projectCategoryList: state => state.contractList.projectCategoryList,// 项目类型
      }),
    },
    mounted() {
      this.getProjectCategoryList();
    },
    methods: {
      ...mapActions({
        uploadContract: 'contractList/uploadContract',
        getProjectCategoryList: 'contractList/getProjectCategoryList',
        contractInput: 'contractList/contractInput',
        addContract: 'contractList/addContract',
        deleteContract: 'contractList/deleteContract'
      }),
      check() {
        this.form.validateFields(
          (err, values) => {
            if (!err) {
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
              this.addContract(values).then((data) => {
                this.$message.success(data.data);
              }).catch((error) => {
                this.$message.error('文件已上传');
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
      handleExcelRemove(file) {
        const index = this.excelFileList.indexOf(file);
        const newFileList = this.excelFileList.slice();
        newFileList.splice(index, 1);
        this.excelFileList = newFileList
      },
      beforeUpload(file) {
        this.handlePdfRemove(file);
        if (file.type === 'application/pdf') {
          const formData = new FormData();
          this.pdfFileList = [...this.pdfFileList, file];
          this.pdfFileList.forEach((file) => {
            formData.append('multipartFiles', file);
          });
          // 手动上传
          this.uploadContract(formData).then((data) => {
            this.fileName = data.data.data;
            this.$message.success('文件已上传');
          }).catch((error) => {
            this.$message.error('上传失败');
          });
        } else {
          this.$message.error('只能上传.pdf文件类型');
          this.handlePdfRemove(file);
        }
        return false;
      },
      beforeUploadXls(file) {
        this.handleExcelRemove(file);
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
          const formData = new FormData();
          this.excelFileList = [...this.excelFileList, file];
          this.excelFileList.forEach((file) => {
            formData.append('multipartFiles', file);
          });
          // 手动上传
          this.contractInput(formData).then((data) => {
            this.$message.success('文件已上传');
          }).catch((error) => {
            this.$message.error('上传失败');
            console.log(error);
          });
        } else {
          this.$message.error('只能上传.xls或者.xlsx文件类型');
          this.handleExcelRemove(file);
        }
        return false;
      },
    },
  }
</script>