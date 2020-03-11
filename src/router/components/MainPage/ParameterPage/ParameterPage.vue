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
      <a-card title="分包类型" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加分包类型" trigger="click" v-model="addOutContractCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-input v-model="newOutContractCategory" size="small" placeholder="请输入分包合同类型"></a-input>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(1)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in outContractCategoryList" :key="item.categoryId"
                     style="width:25%;height: 80px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.categoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-popconfirm
                      @confirm="handleDeleteCategory(item.categoryId, 1)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a>删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card title="分包项目类型" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加分包类型" trigger="click" v-model="addOutProjectCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-input v-model="newOutProjectCategory" size="small" placeholder="请输入分包合同类型"></a-input>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(2)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in outProjectCategoryList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.categoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-popconfirm
                      @confirm="handleDeleteCategory(item.categoryId, 2)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a>删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card title="项目类型" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加分包类型" trigger="click" v-model="addProjectCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-input v-model="newProjectCategory" size="small" placeholder="请输入分包合同类型"></a-input>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(3)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in projectCategoryList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.categoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-popconfirm
                      @confirm="handleDeleteCategory(item.categoryId, 3)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a>删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card title="分项类别" style="margin-bottom: 12px">
        <a-popover slot="extra" title="添加分项类别" trigger="click" v-model="addSubCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-input v-model="newSubCategory" size="small" placeholder="请输入分项类别"></a-input>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(4)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in subCategoryList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.categoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-popconfirm
                      @confirm="handleDeleteCategory(item.categoryId, 4)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a>删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card title="组织方式" style="margin-bottom: 12px">
      <a-popover slot="extra" title="添加组织方式" trigger="click" v-model="addOrganizationVisible">
        <template slot="content">
          <div style="margin-bottom: 8px">
            <a-input v-model="newOrganization" size="small" placeholder="请输入组织方式"></a-input>
          </div>
          <a-button type="primary" size="small" @click="handleAddCategory(5)">添加</a-button>
        </template>
        <a>新增</a>
      </a-popover>
      <a-card-grid v-for="item in organizationList" :key="item.categoryId"
                   style="width:25%;height: 100px;text-align: left;">
        <a-row :gutter="2">
          <a-col span="16">
            {{item.categoryName}}
          </a-col>
          <a-col span="6" style="text-align: right">
            <a-popconfirm
                    @confirm="handleDeleteCategory(item.categoryId, 5)"
                    title="确定删除？"
                    okText="确定"
                    cancelText="取消">
              <a-icon slot="icon" type="question-circle-o" style="color: red"/>
              <a>删除</a>
            </a-popconfirm>
          </a-col>
        </a-row>
      </a-card-grid>
    </a-card>
      <a-card title="生产阶段">
        <a-popover slot="extra" title="添加生产阶段" trigger="click" v-model="addProductionStageVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-input v-model="productionStage" size="small" placeholder="请输入生产阶段"></a-input>
            </div>
            <a-button type="primary" size="small" @click="handleAddCategory(6)">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in productionStageList" :key="item.categoryId"
                     style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.categoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-popconfirm
                      @confirm="handleDeleteCategory(item.categoryId, 6)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                <a>删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  import HeaderPage from "../HeaderPage/HeaderPage";

  export default {
    name: "ParameterPage",
    components: {
      HeaderPage,
    },
    data() {
      return {
        addOutContractCategoryVisible: false,
        newOutContractCategory: '',
        outContractCategoryList: [],
        addOutProjectCategoryVisible: false,
        newOutProjectCategory: '',
        outProjectCategoryList: [],
        addProjectCategoryVisible: false,
        newProjectCategory: '',
        projectCategoryList: [],
        addSubCategoryVisible: false,
        newSubCategory: '',
        subCategoryList: [],
        addOrganizationVisible: false,
        newOrganization: '',
        organizationList: [],
        addProductionStageVisible: false,
        productionStage: '',
        productionStageList: [],
      }
    },
    activated() {
      this.handleUpdateCategory(1);
      this.handleUpdateCategory(2);
      this.handleUpdateCategory(3);
      this.handleUpdateCategory(4);
      this.handleUpdateCategory(5);
      this.handleUpdateCategory(6);
    },
    methods: {
      ...mapActions({
        getCategoryListByNameLike: 'categoryOperation/getCategoryListByNameLike',
        deleteCategory: 'categoryOperation/deleteCategory',
        addCategory: 'categoryOperation/addCategory',
      }),
      handleUpdateCategory(type) {
        this.getCategoryListByNameLike({
          categoryType: type,
          categoryName: '',
        }).then(res => {
          switch (type) {
            case 1:
              this.outContractCategoryList = res && res.data.data;
              break;
            case 2:
              this.outProjectCategoryList = res && res.data.data;
              break;
            case 3:
              this.projectCategoryList = res && res.data.data;
              break;
            case 4:
              this.subCategoryList = res && res.data.data;
              break;
            case 5:
              this.organizationList = res && res.data.data;
              break;
            case 6:
              this.productionStageList = res && res.data.data;
              break;
            default:
              break;
          }
        });
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
              default:
                break;
            }
            this.$message.success('添加成功')
          } else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
    }
  }
</script>