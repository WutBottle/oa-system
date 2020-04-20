<style lang="scss" scoped>
  .ParameterPage {
    .page-content {
      padding: 30px;
    }
  }
</style>

<template>
  <div class="ParameterPage">
    <HeaderPage title="参数配置"/>
    <div class="page-content">
      <a-row style="margin-bottom: 12px;background-color: #ffffff;padding: 12px;">
        <span style="font-size: 14px;margin-right: 12px;">请选择需要配置的参数:</span>
        <a-select defaultValue="分包类型" style="width: 200px" @change="handleChange">
          <a-select-option value="分包类型">分包类型</a-select-option>
          <a-select-option value="分包项目类型">分包项目类型</a-select-option>
          <a-select-option value="项目类型">项目类型</a-select-option>
          <a-select-option value="分项类别">分项类别</a-select-option>
          <a-select-option value="组织方式">组织方式</a-select-option>
          <a-select-option value="生产阶段">生产阶段</a-select-option>
          <a-select-option value="部门">部门</a-select-option>
          <a-select-option value="人员类别">人员类别</a-select-option>
          <a-select-option value="岗位">岗位</a-select-option>
          <a-select-option value="职务">职务</a-select-option>
          <a-select-option value="职级">职级</a-select-option>
        </a-select>
      </a-row>
      <a-card v-show="currentMode === '分包类型'" title="分包类型" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加分包类型" trigger="click" v-model="addOutContractCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="newOutContractCategory" size="small" placeholder="请输入分包合同类型"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(1)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in outContractCategoryList" :key="item.categoryId"
                     style="width:25%;height: 80px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 1)">修改</a>
              </a-row>
              <a-row>
                <a-popconfirm
                        @confirm="handleDeleteCategory(item.categoryId, 1)"
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消">
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a style="color: red">删除</a>
                </a-popconfirm>
              </a-row>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '分包项目类型'" title="分包项目类型" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加分包类型" trigger="click" v-model="addOutProjectCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="newOutProjectCategory" size="small" placeholder="请输入分包合同类型"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(2)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in outProjectCategoryList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 2)">修改</a>
              </a-row>
              <a-row>
                <a-popconfirm
                        @confirm="handleDeleteCategory(item.categoryId, 2)"
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消">
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a style="color: red">删除</a>
                </a-popconfirm>
              </a-row>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '项目类型'" title="项目类型" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加项目类型" trigger="click" v-model="addProjectCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="newProjectCategory" size="small" placeholder="请输入项目类型"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(3)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in projectCategoryList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 3)">修改</a>
              </a-row>
              <a-row>
                <a-popconfirm
                        @confirm="handleDeleteCategory(item.categoryId, 3)"
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消">
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a style="color: red">删除</a>
                </a-popconfirm>
              </a-row>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '分项类别'" title="分项类别" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加分项类别" trigger="click" v-model="addSubCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="newSubCategory" size="small" placeholder="请输入分项类别"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(4)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in subCategoryList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 4)">修改</a>
              </a-row>
              <a-row>
                <a-popconfirm
                        @confirm="handleDeleteCategory(item.categoryId, 4)"
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消">
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a style="color: red">删除</a>
                </a-popconfirm>
              </a-row>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '组织方式'" title="组织方式" style="margin-bottom: 12px">
      <a-popover slot="extra" title="添加组织方式" trigger="click" v-model="addOrganizationVisible">
        <template slot="content">
          <div style="margin-bottom: 8px">
            <a-textarea autoSize v-model="newOrganization" size="small" placeholder="请输入组织方式"></a-textarea>
          </div>
          <a-button type="primary" size="small" @click="handleAddCategory(5)">添加</a-button>
        </template>
        <a>新增</a>
      </a-popover>
      <a-card-grid v-for="item in organizationList" :key="item.categoryId"
                   style="width:25%;height: 100px;text-align: left;">
        <a-row :gutter="2">
          <a-col span="18">
            {{item.categoryName}}
          </a-col>
          <a-col span="5" style="text-align: right">
            <a-row>
              <a @click="handleVerify(item, 5)">修改</a>
            </a-row>
            <a-popconfirm
                    @confirm="handleDeleteCategory(item.categoryId, 5)"
                    title="确定删除？"
                    okText="确定"
                    cancelText="取消">
              <a-icon slot="icon" type="question-circle-o" style="color: red"/>
              <a style="color: red">删除</a>
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-card-grid>
    </a-card>
      <a-card v-show="currentMode === '生产阶段'" title="生产阶段" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加生产阶段" trigger="click" v-model="addProductionStageVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="productionStage" size="small" placeholder="请输入生产阶段"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(6)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in productionStageList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 6)">修改</a>
              </a-row>
              <a-row>
                <a-popconfirm
                        @confirm="handleDeleteCategory(item.categoryId, 6)"
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消">
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a style="color: red">删除</a>
                </a-popconfirm>
              </a-row>

            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '部门'" title="部门" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加部门" trigger="click" v-model="addDepartmentVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="department" size="small" placeholder="请输入部门"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(7)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in departmentList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 7)">修改</a>
              </a-row>
              <a-row>
                <a-popconfirm
                        @confirm="handleDeleteCategory(item.categoryId, 7)"
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消">
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a style="color: red">删除</a>
                </a-popconfirm>
              </a-row>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '人员类别'" title="人员类别" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加人员类别" trigger="click" v-model="addClassificationVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="classification" size="small" placeholder="请输入人员类别"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(8)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in classificationList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 8)">修改</a>
              </a-row>
              <a-popconfirm
                      @confirm="handleDeleteCategory(item.categoryId, 8)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a style="color: red">删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '岗位'" title="岗位" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加岗位" trigger="click" v-model="addJobVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="job" size="small" placeholder="请输入岗位"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(11)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in jobList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 11)">修改</a>
              </a-row>
              <a-popconfirm
                      @confirm="handleDeleteCategory(item.categoryId, 11)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a style="color: red">删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '职务'" title="职务" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加职务" trigger="click" v-model="addDutyVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="duty" size="small" placeholder="请输入职务"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(10)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in dutyList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="18">
              {{item.categoryName}}
            </a-col>
            <a-col span="5" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 10)">修改</a>
              </a-row>
              <a-popconfirm
                      @confirm="handleDeleteCategory(item.categoryId, 10)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a style="color: red">删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card v-show="currentMode === '职级'" title="职级" >
        <a-popover slot="extra" title="添加职级" trigger="click" v-model="addRankVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-textarea autoSize v-model="rank" size="small" placeholder="请输入职级"></a-textarea>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(9)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in rankList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.categoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-row>
                <a @click="handleVerify(item, 9)">修改</a>
              </a-row>
              <a-row>
                <a-popconfirm
                        @confirm="handleDeleteCategory(item.categoryId, 9)"
                        title="确定删除？"
                        okText="确定"
                        cancelText="取消">
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a style="color: red">删除</a>
                </a-popconfirm>
              </a-row>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
    </div>
    <a-modal title="修改参数" v-model="verifyVisible" @ok="handleVerifySubmit">
      <a-textarea autoSize v-model="currentVerifyName" size="small" placeholder="请输入修改参数"></a-textarea>
    </a-modal>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  import HeaderPage from "../HeaderPage/HeaderPage";

  export default {
    name: "ParameterPage",
    components: {
      HeaderPage,
    },
    data() {
      return {
        currentMode: '分包类型',
        addOutContractCategoryVisible: false,
        newOutContractCategory: '',
        addOutProjectCategoryVisible: false,
        newOutProjectCategory: '',
        addProjectCategoryVisible: false,
        newProjectCategory: '',
        addSubCategoryVisible: false,
        newSubCategory: '',
        addOrganizationVisible: false,
        newOrganization: '',
        addProductionStageVisible: false,
        productionStage: '',
        addDepartmentVisible: false,
        department: '',
        addClassificationVisible: false,
        classification: '',
        addRankVisible: false,
        rank: '',
        addDutyVisible: false,
        duty: '',
        addJobVisible: false,
        job: '',
        verifyVisible: false,
        currentVerifyId: '',
        currentVerifyType: '',
        currentVerifyName: '',
      }
    },
    computed: {
      ...mapState({
        outContractCategoryList: state => state.categoryOperation.outContractCategoryList,
        outProjectCategoryList: state => state.categoryOperation.outProjectCategoryList,
        projectCategoryList: state => state.categoryOperation.projectCategoryList,
        subCategoryList: state => state.categoryOperation.subCategoryList,
        organizationList: state => state.categoryOperation.organizationList,
        productionStageList: state => state.categoryOperation.productionStageList,
        departmentList: state => state.categoryOperation.departmentList,
        classificationList: state => state.categoryOperation.classificationList,
        rankList: state => state.categoryOperation.rankList,
        dutyList: state => state.categoryOperation.dutyList,
        jobList: state => state.categoryOperation.jobList,
      })
    },
    methods: {
      ...mapActions({
        getCategoryList: 'categoryOperation/getCategoryList',
        deleteCategory: 'categoryOperation/deleteCategory',
        addCategory: 'categoryOperation/addCategory',
        verifyCategory: 'categoryOperation/verifyCategory'
      }),
      handleUpdateCategory(type) {
        this.getCategoryList({
          categoryType: type,
        })
      },
      handleDeleteCategory(id, type) {
        this.deleteCategory({
          categoryId: id,
        }).then(res => {
          if (res.data.meta.success) {
            this.handleUpdateCategory(type);
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      handleAddCategory(type) {
        let categoryName = '';
        switch (type) {
          case 1:
            categoryName = this.newOutContractCategory;
            break;
          case 2:
            categoryName = this.newOutProjectCategory;
            break;
          case 3:
            categoryName = this.newProjectCategory;
            break;
          case 4:
            categoryName = this.newSubCategory;
            break;
          case 5:
            categoryName = this.newOrganization;
            break;
          case 6:
            categoryName = this.productionStage;
            break;
          case 7:
            categoryName = this.department;
            break;
          case 8:
            categoryName = this.classification;
            break;
          case 9:
            categoryName = this.rank;
            break;
          case 10:
            categoryName = this.duty;
            break;
          case 11:
            categoryName = this.job;
            break;
          default:
            break;
        }
        const params = {
          categoryType: type,
          categoryName: categoryName,
        };
        this.addCategory(params).then(res => {
          if (res.data.meta.success) {
            this.handleUpdateCategory(type);
            switch (type) {
              case 1:
                this.newOutContractCategory = '';
                this.addOutContractCategoryVisible = false;
                break;
              case 2:
                this.newOutProjectCategory = '';
                this.addOutProjectCategoryVisible = false;
                break;
              case 3:
                this.newProjectCategory = '';
                this.addProjectCategoryVisible = false;
                break;
              case 4:
                this.newSubCategory = '';
                this.addSubCategoryVisible = false;
                break;
              case 5:
                this.newOrganization = '';
                this.addOrganizationVisible = false;
                break;
              case 6:
                this.productionStage = '';
                this.addProductionStageVisible = false;
                break;
              case 7:
                this.department = '';
                this.addDepartmentVisible = false;
                break;
              case 8:
                this.classification = '';
                this.addClassificationVisible = false;
                break;
              case 9:
                this.rank = '';
                this.addRankVisible = false;
                break;
              case 10:
                this.duty = '';
                this.addDutyVisible = false;
                break;
              case 11:
                this.job = '';
                this.addJobVisible = false;
                break;
              default:
                break;
            }
            this.$message.success('添加成功')
          } else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      handleChange(value) {
        this.currentMode = value;
      },
      handleVerify(data, type){
        this.verifyVisible = true;
        this.currentVerifyName = data.categoryName;
        this.currentVerifyId = data.categoryId;
        this.currentVerifyType = type;
      },
      handleVerifySubmit() {
        this.verifyCategory({
          categoryName: this.currentVerifyName,
          categoryId: this.currentVerifyId,
          categoryType: this.currentVerifyType,
        }).then(res => {
          if (res && res.data.meta.success){
            this.verifyVisible = false;
            this.$message.success('修改成功');
            this.handleUpdateCategory(this.currentVerifyType);
          }else {
            this.$message.error('服务器错误')
          }
        })
      }
    }
  }
</script>