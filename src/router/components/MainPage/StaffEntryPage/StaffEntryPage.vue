<style lang="scss" scoped>
  .StaffEntryPage {
    .page-content {
      padding: 30px;

      .load-more-list {
        min-height: 350px;
      }
    }
  }
</style>

<template>
  <div class="StaffEntryPage">
    <HeaderPage title="职员管理"/>
    <div class="page-content">
      <div style="background-color: #fff;padding: 24px 32px">
        <a-row style="margin-bottom: 24px">
          <a-form :layout="formLayout">
            <a-form-item
                    label="用户名"
            >
              <a-input placeholder="请输入用户名" v-model="staffName" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleQuery">
                查询
              </a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="showAdd">
                新增
              </a-button>
            </a-form-item>
          </a-form>
        </a-row>
        <a-list class="load-more-list" :loading="loading" itemLayout="horizontal" :dataSource="listData">
          <div
                  v-if="showLoadingMore"
                  slot="loadMore"
                  :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
          >
            <a-spin v-if="loadingMore" />
            <a-button v-else @click="onLoadMore">查看更多</a-button>
          </div>
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-icon slot="actions" type="edit" @click="handleEdit(item)"/>
            <a-popconfirm
                    slot="actions"
                    title="确定删除此用户？"
                    @confirm="confirmDelete(item)"
                    okText="确定"
                    cancelText="取消"
            >
              <a-icon type="delete" :style="{color: 'red'}"/>
            </a-popconfirm>
            <a-list-item-meta
                    :description="'备注：' + item.staffNote"
            >
              <a slot="title">
                职员名称：{{item.staffName}}
                <a-divider type="vertical" />
                员工号：<a-tag color="orange">{{item.staffCode ? item.staffCode : '暂无'}}</a-tag>
              </a>
              <a-avatar
                      slot="avatar"
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </div>
    <a-modal
            title="新增用户"
            v-model="addVisible"
            @ok="submitForm"
            okText="提交"
            cancelText="取消"
            :afterClose="handleAddClose"
            :maskClosable="false"
    >
      <a-form
              :form="addForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="员工号"
        >
          <a-input
                  v-decorator="[
          'staffCode',
          {rules: [{
            required: true, message: '请输入员工号!'
          }]}
        ]"
                  placeholder="请输入员工号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职员名称"
        >
          <a-input
                  v-decorator="[
          'staffName',
          {rules: [{
            required: true, message: '请输入职员名称!'
          }]}
        ]"
                  placeholder="请输入职员名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'staffNote',
          {rules: [{
            required: true, message: '请输入备注!'
          }]}
        ]"
                  placeholder="请输入备注"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
            title="修改用户信息"
            placement="right"
            :closable="false"
            width="550"
            @close="onEditClose"
            :visible="editVisible"
    >
      <a-form
              :form="editForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="员工号"
        >
          <a-input
                  disabled
                  v-decorator="[
          'staffCode',
          {initialValue: this.editFormData.staffCode, rules: [{
            required: true, message: '请输入员工号!'
          }]}
        ]"
                  placeholder="请输入员工号"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职员名称"
        >
          <a-input
                  v-decorator="[
          'staffName',
          {initialValue: this.editFormData.staffName, rules: [{
            required: true, message: '请输入职员名称!'
          }]}
        ]"
                  placeholder="请输入职员名称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="备注"
        >
          <a-input
                  v-decorator="[
          'staffNote',
          {initialValue: this.editFormData.staffNote, rules: [{
            required: true, message: '请输入备注!'
          }]}
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
                  @click="submitEditForm"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";
  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  export default {
    name: "StaffEntryPage",
    components: {
      HeaderPage
    },
    data() {
      return {
        formLayout: 'inline',
        formItemLayout,
        formTailLayout,
        loading: false,
        loadingMore: false,
        staffName: '', // 查询的职员名
        addVisible: false,
        confirmDirty: false,
        addForm: this.$form.createForm(this),
        editVisible: false, // 编辑控制页面
        editFormData: {}, // 编辑当前表单数据
        editForm: this.$form.createForm(this),
        currentStaffId: '', // 当前编辑的用户id
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.staffOperation.paginationProps, // 分页数据
        showLoadingMore: state => state.staffOperation.showLoadingMore, // 控制加载更多按钮
        listData: state => state.staffOperation.listData, // list数据
      }),
    },
    mounted() {
      this.updateListData('first');
    },
    methods: {
      ...mapMutations({
        resetListData: 'staffOperation/resetListData',
      }),
      ...mapActions({
        addStaff: 'staffOperation/addStaff',
        getStaffListByNameLikeList: 'staffOperation/getStaffListByNameLikeList',
        deleteStaff: 'staffOperation/deleteStaff',
        verifyStaff: 'staffOperation/verifyStaff',
      }),
      updateListData(type) {
        if (type === 'first') {
          this.loading = true;
          this.resetListData();
        } else {
          this.loadingMore = true;
        }
        const params = {
          staffName: this.staffName,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize,
        };
        this.getStaffListByNameLikeList(params).then(res => {
          this.loading = false;
          this.loadingMore = false;
        }).catch(error => {
          this.$message.error(error);
          this.loading = false;
          this.loadingMore = false;
        });
      },
      onLoadMore() {
        this.paginationProps.current++;
        this.updateListData();
      },
      showAdd() {
        this.addVisible = true;
      },
      submitForm() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                staffCode: values.staffCode,
                staffName: values.staffName,
                staffNote: values.staffNote,
              };
              this.addStaff(params).then(res => {
                if (res.data.meta.success){
                  this.$message.success('添加成功');
                  this.addVisible = false;
                  this.addForm.resetFields();
                  this.updateListData('first')
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch(error => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      handleAddClose() {
        this.addVisible = false;
        this.addForm.resetFields();
      },
      // 处理查询
      handleQuery() {
        this.updateListData('first');
      },
      // 处理用户删除
      confirmDelete(data) {
        const params = {
          id: data.id
        };
        this.deleteStaff(params).then(res => {
          if (res.data.meta.success) {
            this.$message.success(res.data.meta.message);
            this.updateListData('first')
          } else {
            this.$message.error(res.data.meta.message);
          }
        }).catch(error => {
          this.$message.error(error);
        });
      },
      // 关闭修改弹窗
      onEditClose() {
        this.editVisible = false;
      },
      handleEdit(selectData) {
        this.editFormData = JSON.parse(JSON.stringify(selectData));
        this.currentStaffId = selectData.id;
        this.editForm.resetFields();
        this.editVisible = true;
      },
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                id: this.currentStaffId,
                staffName: values.staffName,
                staffCode: values.staffCode,
                staffNote: values.staffNote,
              };
              this.verifyStaff(params).then((res) => {
                if (res.data.meta.success){
                  this.$message.success('修改成功');
                  this.updateListData('first');
                  this.editVisible = false;
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      }
    }
  }
</script>