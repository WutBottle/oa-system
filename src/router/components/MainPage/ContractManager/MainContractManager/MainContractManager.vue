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
                  label="项目经理"
          >
            <a-select
                    v-decorator="[
          'projectManager',
        ]"
                    :allowClear="true"
                    placeholder="请选择项目经理"
            >
              <a-select-option v-for="d in projectManagerList" :key="d.userId">{{d.username}}<a-divider type="vertical" /><a-tag color="orange">{{d.nickname}}</a-tag></a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="行政专员"
          >
            <a-select
                    v-decorator="[
          'projectSecretary',
        ]"
                    :allowClear="true"
                    placeholder="请选择行政专员"
            >
              <a-select-option v-for="d in projectSecretaryList" :key="d.userId">{{d.username}}<a-divider type="vertical" /><a-tag color="orange">{{d.nickname}}</a-tag></a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="经营负责人"
          >
            <a-select
                    v-decorator="[
          'runningManager',
          {rules: [{ required: true, message: '请选择经营负责人！' }]}
        ]"
                    :allowClear="true"
                    placeholder="请选择经营负责人"
            >
              <a-select-option v-for="d in runningManagerList" :key="d.userId">{{d.username}}<a-divider type="vertical" /><a-tag color="orange">{{d.nickname}}</a-tag></a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
                  :label-col="formItemLayout.labelCol"
                  :wrapper-col="formItemLayout.wrapperCol"
                  label="总监"
          >
            <a-select
                    v-decorator="[
          'inspector',
        ]"
                    :allowClear="true"
                    placeholder="请选择总监"
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
                  label="地上面积(平方米)"
          >
            <a-input
                    v-decorator="[
          'aboveGroundArea',
          {rules: [{
            required: true, message: '请输入地上面积！'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
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
            required: true, message: '请输入地下面积！'
          }, {
                type: 'number',
                message: '请输入数字',
                transform:(value)=> {return Number(value)}
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
          'isSign',
          {rules: [{ required: true, message: '请选择签约状态！' }]}
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
          {rules: [{ required: true, message: '请选择生产阶段！' }]}
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
                  label="备注"
          >
            <a-input
                    v-decorator="[
          'note',
        ]"
                    placeholder="请输入备注"
            />
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
      </div>
    </a-col>
  </a-row>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import moment from 'moment'

  const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 12},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };

  export default {
    name: "MainContractManager",
    data() {
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
        ],
        uploadSpinning: false, // 判断是否正在上传文件
        fetching: false, // 控制拉取列表
        projectCategoryList: [], // 项目类型
        productionStageList: [], // 生产阶段
        projectManagerList: [], // 项目经理列表
        inspectorList: [], // 总监列表
        runningManagerList: [], // 经营负责人列表
        projectSecretaryList: [], // 行政专员列表
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
      this.getCategoryList({
        categoryType: 6
      }).then(res => {
        this.productionStageList = res && res.data.data;
      });
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
        contractInput: 'contractList/contractInput',
        addContract: 'contractList/addContract',
        getCategoryList: 'categoryOperation/getCategoryList', // 获取类型
        getUserListByRoleId: 'userOperation/getUserListByRoleId', // 获取不同角色列表
      }),
      check() {
        this.form.validateFields(
          (err, values) => {
            if (!err) {
              let projectCategory = {};
              projectCategory = this.projectCategoryList[this.projectCategoryList.findIndex((item) => item.categoryId === values.projectCategoryId)];
              delete values.projectCategoryId;
              let productionStageCategory = {};
              productionStageCategory = this.productionStageList[this.productionStageList.findIndex((item) => item.categoryId === values.productionStageId)];
              delete values.productionStageId;
              values = Object.assign(values, {contractFile: this.fileName});
              values = Object.assign(values, {projectCategory: projectCategory});
              values = Object.assign(values, {productionStage: productionStageCategory});
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
              this.addContract(values).then((res) => {
                if (res.data.meta.success){
                  this.$message.success(res.data.data);
                  this.form.resetFields();
                  this.$emit('updateContractTableData');
                } else {
                  this.$message.error(res.data.meta.message);
                }
              })
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
            default:
              this.contractData[index].value = this.contractsData[contractIndex][item.key];
              break;
          }
        })
      },
      onClose() {
        this.visible = false
      },
    },
  }
</script>