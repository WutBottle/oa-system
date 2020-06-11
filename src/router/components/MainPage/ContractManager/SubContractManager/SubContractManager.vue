<style lang="scss" scoped>
  .SubContractManager {
    .form-wrapper {
      padding: 24px 0;
    }
  }
</style>

<template>
  <a-row class="SubContractManager" style="background-color: #fff">
    <a-col :span="24">
      <div class="form-wrapper">
        <a-form :form="form">
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="合同号"
          >
            <a-select
                    v-decorator="[
          'contractId',
          {rules: [{
            required: true, message: '请输入合同号！'
          }]}
        ]"
                    showSearch
                    placeholder="搜索合同号"
                    :showArrow="false"
                    style="width: 300px"
                    :filterOption="false"
                    @search="fetchContracts"
                    @change="handleChange"
                    notFoundContent="无搜索结果"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="(d,index) in contractsData" :key="index">{{d.contractId}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="合同名称"
          >
            <a-input
                    disabled
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
            {rules: [{max: 20, message: '不超过20个字符'}]}
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
                    disabled
                    v-decorator="[
          'designId',
          {initialValue: this.designId}
        ]"
                    placeholder="请输入设计号"
            />
          </a-form-item>
          <a-form-item
                  v-bind="formItemLayout"
                  label="上传合同文件"
          >
            <a-upload
                    v-decorator="[
          'uploadFile',
          {valuePropName: 'uploadFile'}]"
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
          {rules: [{
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
      }]"
                    show-time
                    format="YYYY-MM-DD"
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
          {rules: [{max: 30, message: '不得超过30个字符'}]}
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
          {rules: [{max: 30, message: '不得超过30个字符'}]}
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
          {rules: [{max: 30, message: '不得超过30个字符'}]}
        ]"
                    placeholder="请输入发包方"
            />
          </a-form-item>
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="投资额(元)"
          >
            <a-input
                    v-decorator="[
          'investment',
          {rules: [{
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
          {rules: [{
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
          {rules: [{
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
                  label="地区关键词"
          >
            <a-input
                    v-decorator="[
          'district',
          {rules: [{max: 50, message: '不得超过50个字符'}]}
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
          {rules: [{max: 30, message: '不得超过30个字符'}]}
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
          {rules: [{max: 30, message: '不得超过30个字符'}]}
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
          'isSign',
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
                  label="地域"
          >
            <a-select
                    v-decorator="[
          'region',
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
        ]"
                    placeholder="请选择项目类型"
            >
              <template v-for="item in this.projectCategoryList">
                <a-select-option :key="item.categoryId" :value="item.categoryId">
                  {{item.categoryName}}
                </a-select-option>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item
                  :label-col="formTailLayout.labelCol"
                  :wrapper-col="formTailLayout.wrapperCol"
          >
            <a-spin :spinning="uploadSpinning">
              <a-button
                      type="primary"
                      @click="check"
              >
                提交
              </a-button>
            </a-spin>
          </a-form-item>
        </a-form>
      </div>
    </a-col>
  </a-row>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {debounce} from 'debounce';

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };

  export default {
    name: "SubContractManager",
    data() {
      this.fetchContracts = debounce(this.fetchContracts, 500);
      return {
        formItemLayout,
        formTailLayout,
        form: this.$form.createForm(this),
        fileName: '',
        pdfFileList: [],
        contractsData: [],
        uploadSpinning: false, // 判断是否正在上传文件
        fetching: false, // 控制拉取列表
        contractId: '',
        contractName: '',
        designId: '',
        projectCategoryList: [],
      };
    },
    computed: {
      ...mapState({
        staffData: state => state.staffOperation.staffData, // 职员信息
      }),
    },
    mounted() {
      this.getCategoryList({
        categoryType: 3
      }).then(res => {
        this.projectCategoryList = res && res.data.data;
      });
    },
    methods: {
      ...mapActions({
        uploadContract: 'contractList/uploadContract',
        addContract: 'contractList/addContract',
        getProjectListByIdLike: 'contractList/getProjectListByIdLike',
        getCategoryList: 'categoryOperation/getCategoryList', // 获取类型
      }),
      check() {
        this.form.validateFields(
          (err, values) => {
            if (!err) {
              let projectCategory = {};
              projectCategory = this.projectCategoryList[this.projectCategoryList.findIndex((item) => item.categoryId === values.projectCategoryId)];
              delete values.projectCategoryId;

              values = Object.assign(values, {
                contractId: this.contractId,
                contractFile: this.fileName,
                projectCategory: projectCategory,
                sup: true,
              });
              this.addContract(values).then((res) => {
                if (res.data.meta.success) {
                  this.$message.success(res.data.data);
                  this.form.resetFields();
                  this.$emit('updateContractTableData');
                  this.$emit('closeAddModal');
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch((error) => {
                this.$message.error('添加失败');
              });
            }
          },
        );
      },
      handlePdfRemove(file) {
        const index = this.pdfFileList.indexOf(file);
        const newFileList = this.pdfFileList.slice();
        newFileList.splice(index, 1);
        this.pdfFileList = newFileList;
      },
      beforeUpload(file) {
        this.uploadSpinning = true;
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
            this.uploadSpinning = false;
          }).catch((error) => {
            this.$message.error('上传失败');
            this.uploadSpinning = false;
          });
        } else {
          this.$message.error('只能上传.pdf文件类型');
          this.handlePdfRemove(file);
          this.uploadSpinning = false;
        }
        return false;
      },
      onClose() {
        this.visible = false
      },
      fetchContracts(value) {
        const params = {
          contractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getProjectListByIdLike(params).then((res) => {
          this.contractsData = res.data.data.content;
          this.fetching = false;
        });
      },
      handleChange(value) {
        this.contractId = this.contractsData[value].contractId;
        this.designId =  this.contractsData[value].designId;
        this.contractName = this.contractsData[value].contractName;
        this.form.setFieldsValue({
          contractId: this.contractId,
          designId: this.designId,
          contractName: this.contractName,
        });
      }
    },
  }
</script>