<style lang="scss" scoped>
  .MainContractManager {
    .form-wrapper {
      padding: 24px 0;
    }

    .xls-upload {
      padding: 24px 24px 0 0;
    }
  }
</style>

<template>
  <a-row class="MainContractManager" style="background-color: #fff">
    <a-col :span="15">
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
          {rules: [{
            required: true, message: '请输入合同号！'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
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
          {rules: [{
            required: true, message: '请输入发包人合同编号！'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
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
            <a-select
                    v-decorator="[
          'runningManager',
          {rules: [{ required: true, message: '请输入经营经理！' }]}
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
          {rules: [{ required: true, message: '请输入项目经理！' }]}
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
          {rules: [{ required: true, message: '请输入项目预算秘书！' }]}
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
          {rules: [{
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
    <a-col :span="9">
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
          <a-list
                  bordered
                  size="small"
                  class="contract-list"
                  itemLayout="horizontal"
                  :dataSource="contractsData"
                  style="margin-top: 8px"
          >
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-list-item-meta>
                <a slot="title" @click="showDrawer(index)">合同{{item.contractId}}</a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
          <a-drawer
                  title="合同详情"
                  placement="right"
                  :width="720"
                  :closable="false"
                  @close="onClose"
                  :visible="visible"
          >
            <a-list :grid="{ gutter: 8, column: 2}" :dataSource="contractData">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-card :title="item.title">{{item.value}}</a-card>
              </a-list-item>
            </a-list>
          </a-drawer>
        </a-affix>
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
    name: "MainContractManager",
    data() {
      this.fetchStaffData = debounce(this.fetchStaffData, 800);
      return {
        formItemLayout,
        formTailLayout,
        form: this.$form.createForm(this),
        fileName: '',
        pdfFileList: [],
        excelFileList: [],
        contractsData: [],
        visible: false,
        contractData: [
          {
            key: 'contractId',
            title: '合同号',
            value: '',
          },
          {
            key: 'contractName',
            title: '合同名称',
            value: '',
          },
          {
            key: 'ownerId',
            title: '发包人合同编号',
            value: '',
          },
          {
            key: 'designId',
            title: '设计编号',
            value: '',
          },
          {
            key: 'contractAmount',
            title: '合同额(元)',
            value: '',
          },
          {
            key: 'actualDate',
            title: '实际签约日期',
            value: '',
          },
          {
            key: 'contractDate',
            title: '合同归档日期',
            value: '',
          },
          {
            key: 'departmentDesign',
            title: '主设计部门',
            value: '',
          },
          {
            key: 'departmentRunning',
            title: '经营部门',
            value: '',
          },
          {
            key: 'runningManager',
            title: '经营经理',
            value: '',
          },
          {
            key: 'projectManager',
            title: '项目经理',
            value: '',
          },
          {
            key: 'projectSecretary',
            title: '项目预算秘书',
            value: '',
          },
          {
            key: 'owner',
            title: '发包方',
            value: '',
          },
          {
            key: 'investment',
            title: '投资额(万元)',
            value: '',
          },
          {
            key: 'scale',
            title: '项目规模(平方米)',
            value: '',
          },
          {
            key: 'district',
            title: '地区关键词',
            value: '',
          },
          {
            key: 'buildOne',
            title: '建筑一级分类',
            value: '',
          },
          {
            key: 'buildTwo',
            title: '建筑二级分类',
            value: '',
          },
          {
            key: 'sign',
            title: '签约状态',
            value: '',
          },
          {
            key: 'region',
            title: '地域',
            value: '',
          },
          {
            key: 'epc',
            title: '是否EPC项目',
            value: '',
          },
          {
            key: 'projectCategory',
            title: '项目类型',
            value: '',
          },
          {
            key: 'contractNodes',
            title: '合同节点',
            value: '',
          },
        ],
        uploadSpinning: false, // 判断是否正在上传文件
        fetching: false, // 控制拉取列表
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
        contractInput: 'contractList/contractInput',
        addContract: 'contractList/addContract',
        getStaffListByNameLike: 'staffOperation/getStaffListByNameLike'
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
                this.$message.success(data.data.data);
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
      handleExcelRemove(file) {
        const index = this.excelFileList.indexOf(file);
        const newFileList = this.excelFileList.slice();
        newFileList.splice(index, 1);
        this.excelFileList = newFileList
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
      beforeUploadXls(file) {
        this.handleExcelRemove(file);
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
          this.contractsData = []; // 初始化录入合同列表
          const formData = new FormData();
          this.excelFileList = [...this.excelFileList, file];
          this.excelFileList.forEach((file) => {
            formData.append('multipartFiles', file);
          });
          // 手动上传
          this.contractInput(formData).then((data) => {
            for (let i = 1; i < data.data.data.inputSize + 1; i++) {
              this.$notification.open({
                message: data.data.data[i],
                duration: 10,
                icon: data.data.data[i].indexOf('添加成功') != -1 ? <a-icon type="check-circle" style="color: green" /> : <a-icon type="close-circle" style="color: red" />,
            });
              this.contractsData = data.data.data.contracts;
            }
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
      showDrawer(index) {
        this.handleContractsData(index);
        this.visible = true
      },
      handleContractsData(contractIndex){
        this.contractData.forEach((item, index) => {
          switch (this.contractData[index].key) {
            case 'contractDate':
              this.contractData[index].value = moment(this.contractsData[contractIndex][item.key]).format('YYYY-MM-DD HH:mm:ss');
              break;
            case 'actualDate':
              this.contractData[index].value = moment(this.contractsData[contractIndex][item.key]).format('YYYY-MM-DD HH:mm:ss');
              break;
            case 'sign':
              if (this.contractsData[contractIndex][item.key] === true){
                this.contractData[index].value = '已签约'
              }else {
                this.contractData[index].value = '未签约'
              }
              break;
            case 'region':
              if (this.contractsData[contractIndex][item.key] === true){
                this.contractData[index].value = '省内'
              }else {
                this.contractData[index].value = '省外'
              }
              break;
            case 'epc':
              if (this.contractsData[contractIndex][item.key] === true){
                this.contractData[index].value = '是'
              }else {
                this.contractData[index].value = '否'
              }
              break;
            case 'projectCategory':
              this.contractData[index].value = this.contractsData[contractIndex][item.key].projectCategoryName
              break;
            case 'contractNodes':
              let temp = '';
              this.contractsData[contractIndex][item.key].forEach((item) => {
                temp += item.nodeDescription;
              });
              this.contractData[index].value = temp;
              break;
            default:
              this.contractData[index].value = this.contractsData[contractIndex][item.key];
              break;
          }
        })
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
      }
    },
  }
</script>