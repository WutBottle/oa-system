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
            <a-button type="primary" size="small" @click="handleAddOutContractCategory">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in outContractCategoryList" :key="item.outContractCategoryId" style="width:25%;height: 80px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.outContractCategoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-popconfirm
                      @confirm="handleDeleteOutContractCategory(item.outContractCategoryId)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
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
            <a-button type="primary" size="small" @click="handleAddOutProjectCategory">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in outProjectCategoryList" :key="item.outProjectCategoryId" style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.outProjectCategoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-popconfirm
                      @confirm="handleDeleteOutProjectCategory(item.outProjectCategoryId)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a>删除</a>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-card-grid>
      </a-card>
      <a-card title="项目类型">
        <a-popover slot="extra" title="添加分包类型" trigger="click" v-model="addProjectCategoryVisible">
          <template slot="content">
            <div style="margin-bottom: 8px">
              <a-input v-model="newProjectCategory" size="small" placeholder="请输入分包合同类型"></a-input>
            </div>
            <a-button type="primary" size="small" @click="handleAddProjectCategory">添加</a-button>
          </template>
          <a>新增</a>
        </a-popover>
        <a-card-grid v-for="item in projectCategoryList" :key="item.projectCategoryId" style="width:25%;height: 100px;text-align: left;">
          <a-row :gutter="2">
            <a-col span="16">
              {{item.projectCategoryName}}
            </a-col>
            <a-col span="6" style="text-align: right">
              <a-popconfirm
                      @confirm="handleDeleteProjectCategory(item.projectCategoryId)"
                      title="确定删除？"
                      okText="确定"
                      cancelText="取消">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
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
  import {mapState, mapActions} from 'vuex'

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
      }
    },
    activated() {
      this.handleUpdateOutContractCategory();
      this.handleUpdateOutProjectCategory();
      this.handleUpdateProjectCategory();
    },
    methods: {
      ...mapActions({
        getOutContractCategoryListByNameLike: 'outContractCategoryOperation/getOutContractCategoryListByNameLike',
        deleteOutContractCategory: 'outContractCategoryOperation/deleteOutContractCategory',
        addOutContractCategory: 'outContractCategoryOperation/addOutContractCategory',
        getOutProjectCategoryList: 'outProjectCategoryOperation/getOutProjectCategoryList',
        deleteOutProjectCategory: 'outProjectCategoryOperation/deleteOutProjectCategory',
        addOutProjectCategory: 'outProjectCategoryOperation/addOutProjectCategory',
        getProjectCategoryListByNameLike: 'projectCategoryOperation/getProjectCategoryListByNameLike',
        deleteProjectCategory: 'projectCategoryOperation/deleteProjectCategory',
        addProjectCategory: 'projectCategoryOperation/addProjectCategory',
      }),
      handleUpdateOutContractCategory() {
        this.getOutContractCategoryListByNameLike({
          outContractCategoryName: '',
        }).then(res => {
          this.outContractCategoryList = res.data.data;
        });
      },
      handleDeleteOutContractCategory(id) {
        this.deleteOutContractCategory({
          outContractCategoryId: id,
        }).then(res => {
          if (res.data.meta.success) {
            this.handleUpdateOutContractCategory();
            this.$message.success('删除成功')
          }else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      handleAddOutContractCategory() {
        const params = {
          outContractCategoryName: this.newOutContractCategory,
        };
        this.addOutContractCategory(params).then(res => {
          if (res.data.meta.success) {
            this.handleUpdateOutContractCategory();
            this.newOutContractCategory = '';
            this.addOutContractCategoryVisible = false;
            this.$message.success('添加成功')
          }else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      handleUpdateOutProjectCategory() {
        this.getOutProjectCategoryList().then(res => {
          this.outProjectCategoryList = res.data.data;
        });
      },
      handleDeleteOutProjectCategory(id) {
        this.deleteOutProjectCategory({
          outProjectCategoryId: id,
        }).then(res => {
          if (res.data.meta.success) {
            this.handleUpdateOutProjectCategory();
            this.$message.success('删除成功')
          }else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      handleAddOutProjectCategory() {
        const params = {
          outProjectCategoryName: this.newOutProjectCategory,
        };
        this.addOutProjectCategory(params).then(res => {
          if (res.data.meta.success) {
            this.handleUpdateOutProjectCategory();
            this.newOutProjectCategory = '';
            this.addOutProjectCategoryVisible = false;
            this.$message.success('添加成功')
          }else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      handleUpdateProjectCategory() {
        this.getProjectCategoryListByNameLike({
          projectCategoryName: '',
        }).then(res => {
          this.projectCategoryList = res.data.data;
        });
      },
      handleAddProjectCategory() {
        const params = {
          projectCategoryName: this.newProjectCategory,
        };
        this.addProjectCategory(params).then(res => {
          if (res.data.meta.success) {
            this.handleUpdateProjectCategory();
            this.newProjectCategory = '';
            this.addProjectCategoryVisible = false;
            this.$message.success('添加成功')
          }else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
      handleDeleteProjectCategory(id) {
        this.deleteProjectCategory({
          projectCategoryId: id,
        }).then(res => {
          if (res.data.meta.success) {
            this.handleUpdateProjectCategory();
            this.$message.success('删除成功')
          }else {
            this.$message.error(res.data.meta.message)
          }
        })
      },
    }
  }
</script>