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
          {rules: [{ required: true, message: '请输入发包人合同编号！' },{
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value) || ''}
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
                    disabled
                    v-decorator="[
          'designId',
          {initialValue: this.designId, rules: [{ required: true, message: '请输入设计号！' }]}
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
          {valuePropName: 'uploadFile', rules: [{ required: true, message: '请上传合同文件！' }]}]"
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
        ]"
                    placeholder="请输入经营部门"
            />
          </a-form-item>
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="经营经理"
          >
            <a-select
                    v-decorator="[
          'runningManager',
        ]"
                    placeholder="请输入经营经理"
                    showSearch
                    :showArrow="false"
                    :filterOption="false"
                    @search="fetchStaffData"
                    notFoundContent="无该人员数据"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in staffData" :key="d.id">{{d.staffName}}<a-divider type="vertical" /><a-tag color="orange">{{d.staffCode}}</a-tag></a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="项目经理"
          >
            <a-select
                    v-decorator="[
          'projectManager',
        ]"
                    placeholder="请输入项目经理"
                    showSearch
                    :showArrow="false"
                    :filterOption="false"
                    @search="fetchStaffData"
                    notFoundContent="无该人员数据"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in staffData" :key="d.id">{{d.staffName}}<a-divider type="vertical" /><a-tag color="orange">{{d.staffCode}}</a-tag></a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="项目预算秘书"
          >
            <a-select
                    v-decorator="[
          'projectSecretary',
        ]"
                    placeholder="请输入项目预算秘书"
                    showSearch
                    :showArrow="false"
                    :filterOption="false"
                    @search="fetchStaffData"
                    notFoundContent="无该人员数据"
                    :defaultActiveFirstOption="false"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
              <a-select-option v-for="d in staffData" :key="d.id">{{d.staffName}}<a-divider type="vertical" /><a-tag color="orange">{{d.staffCode}}</a-tag></a-select-option>
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
          {rules: [{ required: true, message: '请输入投资额！' }, {
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
          {rules: [{
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
        ]"
                    mode="tags"
                    placeholder="请输入合同节点"
            >
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
  import moment from 'moment'
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
      this.fetchStaffData = debounce(this.fetchStaffData, 800);
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
      };
    },
    computed: {
      ...mapState({
        projectCategoryList: state => state.contractList.projectCategoryList,// 项目类型
        staffData: state => state.staffOperation.staffData, // 职员信息
      }),
    },
    mounted() {
      this.getProjectCategoryList();
    },
    methods: {
      ...mapActions({
        uploadContract: 'contractList/uploadContract',
        getProjectCategoryList: 'contractList/getProjectCategoryList',
        addContract: 'contractList/addContract',
        getStaffListByNameLike: 'staffOperation/getStaffListByNameLike',
        getProjectListByIdLike: 'contractList/getProjectListByIdLike',
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
              values.contractNodes && contractNodes.forEach((item) => {
                tempContractNodes.push({
                  nodeDescription: item
                })
              });
              values = Object.assign(values, {
                contractId: this.contractId,
                contractNodes: tempContractNodes,
                contractFile: this.fileName,
                projectCategory: projectCategory,
                sup: true,
              });
              values.projectManager = {
                id: values.projectManager
              };
              values.runningManager = {
                id: values.runningManager
              };
              values.projectSecretary = {
                id: values.projectSecretary
              };
              this.addContract(values).then((data) => {
                if (data.data.meta.success) {
                  this.$message.success(data.data.meta.message);
                } else {
                  this.$message.error(data.data.meta.message);
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
      fetchStaffData(value) {
        const params = {
          staffName: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getStaffListByNameLike(params).then((res) => {
          this.fetching = false;
        });
      },
      fetchContracts(value) {
        const params = {
          contractId: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.data = [];
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