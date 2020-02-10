<style lang="scss" scoped>
  .UsersPage {
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
      padding: 30px;

      .load-more-list {
        min-height: 350px;
      }
    }
  }
</style>

<template>
  <div class="UsersPage">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      </a-breadcrumb>
      <p class="title">用户管理</p>
    </div>
    <div class="page-content">
      <div style="background-color: #fff;padding: 24px 32px">
        <a-row style="margin-bottom: 24px">
          <a-form :layout="formLayout">
            <a-form-item
                    label="用户名"
            >
              <a-input placeholder="请输入用户名" v-model="userName" />
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
            <a-icon slot="actions" type="edit" />
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
                    :description="'昵称：' + item.nickname"
            >
              <a slot="title">
                用户名：{{item.username}}<a-divider type="vertical" />
                <a-tag v-for="tag in item.roles" :color="tag.id === 1 ? 'green' : 'red'"
                       :key="tag.nodeId">{{tag.id === 1 ? '普通用户' : '管理员'}}</a-tag>
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
                label="用户名"
        >
          <a-input
                  v-decorator="[
          'userName',
          {rules: [{
            required: true, message: '请输入用户名!'
          }]}
        ]"
                  placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="密码"
        >
          <a-input
                  v-decorator="[
          'password',
          {rules: [{
            required: true, message: '请输入密码!'
          },{
                validator: validateToNextPassword,
          }]}
        ]"
                  type="password"
                  placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="确认密码">
          <a-input
                  v-decorator="[
          'confirm',
          {
            rules: [
              {
                required: true,
                message: '请确认密码!',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          },
        ]"
                  placeholder="请确认密码"
                  type="password"
                  @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="昵称"
        >
          <a-input
                  v-decorator="[
          'nickName',
          {rules: [{
            required: true, message: '请输入昵称!'
          }]}
        ]"
                  placeholder="请输入昵称"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="用户权限"
        >
          <a-select
                  v-decorator="[
          'roles',
          { rules: [{ required: true, message: '请选择用户权限!' }] },
        ]"
                  placeholder="请选择用户权限"
          >
            <a-select-option value="1">
              普通用户
            </a-select-option>
            <a-select-option value="2">
              管理员
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'

  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 14},
  };
  export default {
    name: "UsersPage",
    data() {
      return {
        formLayout: 'inline',
        formItemLayout,
        loading: false,
        loadingMore: false,
        userName: '', // 查询的用户名
        addVisible: false,
        confirmDirty: false,
        addForm: this.$form.createForm(this),
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.userOperation.paginationProps, // 分页数据
        showLoadingMore: state => state.userOperation.showLoadingMore, // 控制加载更多按钮
        listData: state => state.userOperation.listData, // list数据
      }),
    },
    mounted() {
      this.updateListData('first');
    },
    methods: {
      ...mapMutations({
        resetListData: 'userOperation/resetListData',
      }),
      ...mapActions({
        register: 'userOperation/register',
        getUserListByNameLike: 'userOperation/getUserListByNameLike',
      }),
      updateListData(type) {
        if (type === 'first') {
          this.loading = true;
          this.resetListData();
        } else {
          this.loadingMore = true;
        }
        const params = {
          username: this.userName,
          pageNum: this.paginationProps.current,
          pageLimit: this.paginationProps.pageSize,
        };
        this.getUserListByNameLike(params).then(res => {
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
                username: values.userName,
                password: values.password,
                nickname: values.nickName,
                roles: [{
                  id: values.roles
                }]
              };
              this.register(params).then(res => {
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
      handleConfirmBlur(e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
      },
      compareToFirstPassword(rule, value, callback) {
        const form = this.addForm;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次密码输入不一致!');
        } else {
          callback();
        }
      },
      validateToNextPassword(rule, value, callback) {
        const form = this.addForm;
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      },
      // 处理查询
      handleQuery() {
        this.updateListData('first');
      },
      // 处理用户删除
      confirmDelete(data) {
        console.log(data)
      }
    }
  }
</script>