<style lang="scss" scoped>
  .UsersPage {
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
    <HeaderPage title="用户管理"/>
    <div class="page-content">
      <div style="background-color: #fff;padding: 24px 32px">
        <a-row style="margin-bottom: 24px">
          <a-form :layout="formLayout">
            <a-form-item
                    label="用户名"
            >
              <a-input placeholder="请输入用户名" v-model="userName"/>
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
            <a-spin v-if="loadingMore"/>
            <a-button v-else @click="onLoadMore">查看更多</a-button>
          </div>
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-tooltip slot="actions">
              <template slot="title">
                编辑用户
              </template>
              <a-icon type="edit" @click="handleEdit(item)"/>
            </a-tooltip>
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
                    :description="'真实姓名：' + item.staff.staffName"
            >
              <a slot="title">
                用户名：{{item.username}}
                <a-divider type="vertical"/>
                <a-tag v-for="tag in item.roles" color="green"
                       :key="tag.id">{{tag.name}}
                </a-tag>
              </a>
              <a-avatar
                      slot="avatar"
                      :src="avatarSetting[item.roles[0].name]"
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
                label="用户权限"
        >
          <a-select
                  v-decorator="[
          'roles',
          { rules: [{ required: true, message: '请选择用户权限!' }] },
        ]"
                  placeholder="请选择用户权限"
          >
            <a-select-option v-for="d in roleList" :key="d.id">{{d.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职员名称"
        >
          <a-select
                  v-decorator="[
          'staff',
          {rules: [{ required: true, message: '请选择职员！' }]}
        ]"
                  placeholder="请选择职员"
                  showSearch
                  :showArrow="false"
                  :filterOption="false"
                  @search="fetchStaffData"
                  notFoundContent="无该人员数据"
                  :defaultActiveFirstOption="false"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="d in staffData" :key="d.id">{{d.staffName}}
              <a-divider type="vertical"/>
              <a-tag color="orange">{{d.staffCode}}</a-tag>
            </a-select-option>
          </a-select>
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
                label="用户名"
        >
          <a-input
                  disabled
                  v-decorator="[
          'userName',
          {initialValue: this.editFormData.username, rules: [{
            required: true, message: '请输入用户名!'
          }]}
        ]"
                  placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="用户权限"
        >
          <a-select
                  v-decorator="[
          'roles',
          {initialValue: this.editFormData.roles, rules: [{ required: true, message: '请选择用户权限!' }] },
        ]"
                  placeholder="请选择用户权限"
          >
            <a-select-option v-for="d in roleList" :key="d.id">{{d.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="职员名称"
        >
          <a-select
                  v-decorator="[
          'staff',
          {initialValue: this.editFormData.staff && this.editFormData.staff.id, rules: [{ required: true, message: '请选择职员！' }]}
        ]"
                  placeholder="请选择职员"
                  showSearch
                  :showArrow="false"
                  :filterOption="false"
                  @search="fetchStaffData"
                  notFoundContent="无该人员数据"
                  :defaultActiveFirstOption="false"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="d in staffData" :key="d.id">{{d.staffName}}
              <a-divider type="vertical"/>
              <a-tag color="orange">{{d.staffCode}}</a-tag>
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
                v-bind="formItemLayout"
                label="新的密码"
        >
          <a-input
                  v-decorator="[
          'password',
        ]"
                  type="password"
                  placeholder="未修改密码可不填"
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
  import {mapState, mapActions, mapMutations} from 'vuex';
  import {debounce} from 'debounce';
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
    name: "UsersPage",
    components: {
      HeaderPage,
    },
    data() {
      this.fetchStaffData = debounce(this.fetchStaffData, 500);
      return {
        formLayout: 'inline',
        formItemLayout,
        formTailLayout,
        loading: false,
        loadingMore: false,
        userName: '', // 查询的用户名
        addVisible: false,
        confirmDirty: false,
        addForm: this.$form.createForm(this),
        editVisible: false, // 编辑控制页面
        editFormData: {}, // 编辑当前表单数据
        editForm: this.$form.createForm(this),
        currentUserId: '', // 当前编辑的用户id
        avatarSetting: {
          部门负责人: require('@/assets/总监.png'),
          超级管理员: require('@/assets/超级管理员.png'),
          普通用户: require('@/assets/普通用户.png'),
        },
        fetching: false,
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.userOperation.paginationProps, // 分页数据
        showLoadingMore: state => state.userOperation.showLoadingMore, // 控制加载更多按钮
        listData: state => state.userOperation.listData, // list数据
        roleList: state => state.roleOperation.roleList, // 角色list数据
        role: state => state.tokensOperation.role, // 用户角色
        staffData: state => state.staffOperation.staffData, // 职员信息
      }),
    },
    mounted() {
      this.updateListData('first');
      this.getRoleList();
    },
    methods: {
      ...mapMutations({
        resetListData: 'userOperation/resetListData',
        setStaffData: 'staffOperation/setStaffData',
      }),
      ...mapActions({
        register: 'userOperation/register',
        getUserListByNameLike: 'userOperation/getUserListByNameLike',
        deleteUser: 'userOperation/deleteUser',
        verifyUser: 'userOperation/verifyUser',
        getRoleList: 'roleOperation/getRoleList',
        getStaffNamesByNameLike: 'staffOperation/getStaffNamesByNameLike',
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
                roles: [{
                  id: values.roles
                }],
                staff: {
                  id: values.staff
                },
              };
              this.register(params).then(res => {
                if (res.data.meta.success) {
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
          form.validateFields(['confirm'], {force: true});
        }
        callback();
      },
      // 处理查询
      handleQuery() {
        this.updateListData('first');
      },
      // 处理用户删除
      confirmDelete(data) {
        const params = {
          userId: data.userId
        };
        this.deleteUser(params).then(res => {
          if(res.data.meta.success){
            this.$message.success(res.data.data);
            this.updateListData('first')
          } else {
            this.$message.error(res.data.meta.message);
          }
        })
      },
      // 关闭修改弹窗
      onEditClose() {
        this.editVisible = false;
      },
      handleEdit(selectData) {
        this.setStaffData({
          content: [selectData.staff || []],
        });
        this.editFormData = JSON.parse(JSON.stringify(selectData));
        this.editFormData.roles = this.editFormData.roles[0] && Number(this.editFormData.roles[0].id);
        this.currentUserId = selectData.userId;
        this.editVisible = true;
      },
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              let params = {
                userId: this.currentUserId,
                username: values.userName,
                roles: [{
                  id: values.roles
                }],
                staff: {
                  id: values.staff
                },
              };
              if (values.password) {
                Object.assign(params, {
                  password: values.password
                })
              }
              this.verifyUser(params).then((res) => {
                if (res.data.meta.success) {
                  this.$message.success('修改成功');
                  this.editForm.resetFields();
                  this.updateListData('first');
                  this.editVisible = false;
                } else {
                  this.editForm.resetFields();
                  this.$message.error(res.data.meta.message);
                }
              }).catch((error) => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      fetchStaffData(value) {
        const params = {
          staffName: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getStaffNamesByNameLike(params).then((res) => {
          this.fetching = false;
        });
      }
    }
  }
</script>