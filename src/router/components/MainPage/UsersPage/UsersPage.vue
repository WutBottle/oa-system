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
                权限分配
              </template>
              <a-icon type="lock" @click="handlePermission(item)"/>
            </a-tooltip>
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
                    :description="'真实姓名：' + item.nickname"
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
                label="真实姓名"
        >
          <a-input
                  v-decorator="[
          'nickName',
          {rules: [{
            required: true, message: '请输入真实姓名!'
          }]}
        ]"
                  placeholder="请输入真实姓名"
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
                label="真实姓名"
        >
          <a-input
                  v-decorator="[
          'nickName',
          {initialValue: this.editFormData.nickname, rules: [{
            required: true, message: '请输入真实姓名!'
          }]}
        ]"
                  placeholder="请输入真实姓名"
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
    <a-drawer
            title="分配用户权限"
            placement="right"
            width="615"
            @close="onPermissionClose"
            :visible="permissionVisible"
    >
      <a-row style="margin-bottom: 16px">
        <PermissionComponent ref="contractPermission" title="合同管理权限" :defaultCheckedList="defaultCheckedListContract"/>
      </a-row>
      <a-row style="margin-bottom: 16px">
        <PermissionComponent ref="subProjectPermission" title="分项分包权限" :defaultCheckedList="defaultCheckedListSupProject"/>
      </a-row>
      <a-row style="margin-bottom: 16px">
        <PermissionComponent ref="receiptPermission" title="合同发票权限" :defaultCheckedList="defaultCheckedListReceipt"/>
      </a-row>
      <a-row style="margin-bottom: 16px">
        <PermissionComponent ref="cashPermission" title="合同现金权限" :defaultCheckedList="defaultCheckedListCash"/>
      </a-row>
      <a-row style="margin-bottom: 16px">
        <PermissionComponent ref="outReceiptPermission" title="分包发票权限" :defaultCheckedList="defaultCheckedListOutReceipt"/>
      </a-row>
      <a-row style="margin-bottom: 24px">
        <PermissionComponent ref="outPaidPermission" title="分包付款权限" :defaultCheckedList="defaultCheckedListOutPaid"/>
      </a-row>
      <a-row style="margin-bottom: 24px">
        <PermissionComponent ref="staffPermission" title="职员管理权限" :defaultCheckedList="defaultCheckedListStaff"/>
      </a-row>
      <a-row style="margin-bottom: 24px">
        <PermissionComponent ref="salaryPermission" title="工资管理权限" :defaultCheckedList="defaultCheckedListSalary"/>
      </a-row>
      <a-row>
        <a-button type="primary" block @click="handlePermissionSubmit">确定</a-button>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";
  import PermissionComponent from "./PermissionComponent/PermissionComponent";

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
      PermissionComponent,
    },
    data() {
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
        permissionVisible: false, // 分配权限页面
        defaultCheckedListContract: [], // 合同默认权限
        defaultCheckedListSupProject: [], // 分项默认权限
        defaultCheckedListReceipt: [], // 合同发票默认权限
        defaultCheckedListCash: [], // 合同现金默认权限
        defaultCheckedListOutReceipt: [], // 分包发票默认权限
        defaultCheckedListOutPaid: [], // 分包付款默认权限
        defaultCheckedListStaff: [], // 职员管理默认权限
        defaultCheckedListSalary: [], // 工资管理默认权限
        avatarSetting: {
          部门负责人: require('@/assets/总监.png'),
          超级管理员: require('@/assets/超级管理员.png'),
          普通用户: require('@/assets/普通用户.png'),
        },
      }
    },
    computed: {
      ...mapState({
        paginationProps: state => state.userOperation.paginationProps, // 分页数据
        showLoadingMore: state => state.userOperation.showLoadingMore, // 控制加载更多按钮
        listData: state => state.userOperation.listData, // list数据
        roleList: state => state.roleOperation.roleList, // 角色list数据
        role: state => state.tokensOperation.role, // 用户角色
      }),
    },
    mounted() {
      this.updateListData('first');
      this.getRoleList();
    },
    methods: {
      ...mapMutations({
        resetListData: 'userOperation/resetListData',
      }),
      ...mapActions({
        register: 'userOperation/register',
        getUserListByNameLike: 'userOperation/getUserListByNameLike',
        deleteUser: 'userOperation/deleteUser',
        verifyUser: 'userOperation/verifyUser',
        getRoleList: 'roleOperation/getRoleList',
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
                nickname: values.nickName,
                roles: [{
                  id: values.roles
                }]
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
      handlePermission(selectData) {
        this.currentUserId = selectData.userId;
        this.handleDataDecoder(selectData.authorityCode === null ? '0101010101010101' : selectData.authorityCode);
        this.permissionVisible = true;
      },
      binary(num, Bits) {
        let resArry = [];
        let xresArry = [];
        let i = 0;
        //除2取余
        for (; num > 0;) {
          resArry.push(num % 2);
          num = parseInt(num / 2);
          i++;
        }
        //倒序排列
        for (let j = i - 1; j >= 0; j--) {
          xresArry.push(resArry[j]);
        }
        //补0操作
        if (Bits) {
          for (let r = xresArry.length; r < Bits; r++) {
            xresArry.unshift("0");
          }
        }
        return xresArry.join().replace(/,/g, "");
      },
      handleDataDecoder(authorityCode) {
        this.defaultCheckedListContract = this.setDefaultCheckedList(Number(authorityCode.substr(0,2)));
        this.defaultCheckedListSupProject = this.setDefaultCheckedList(Number(authorityCode.substr(2,2)));
        this.defaultCheckedListReceipt = this.setDefaultCheckedList(Number(authorityCode.substr(4,2)));
        this.defaultCheckedListCash = this.setDefaultCheckedList(Number(authorityCode.substr(6,2)));
        this.defaultCheckedListOutReceipt = this.setDefaultCheckedList(Number(authorityCode.substr(8,2)));
        this.defaultCheckedListOutPaid = this.setDefaultCheckedList(Number(authorityCode.substr(10,2)));
        this.defaultCheckedListStaff = this.setDefaultCheckedList(Number(authorityCode.substr(12,2)));
        this.defaultCheckedListSalary = this.setDefaultCheckedList(Number(authorityCode.substr(14,2)));

        this.$refs.contractPermission && this.$refs.contractPermission.setCheckedList(this.defaultCheckedListContract);
        this.$refs.subProjectPermission && this.$refs.subProjectPermission.setCheckedList(this.defaultCheckedListSupProject);
        this.$refs.receiptPermission && this.$refs.receiptPermission.setCheckedList(this.defaultCheckedListReceipt);
        this.$refs.cashPermission && this.$refs.cashPermission.setCheckedList(this.defaultCheckedListCash);
        this.$refs.outReceiptPermission && this.$refs.outReceiptPermission.setCheckedList(this.defaultCheckedListOutReceipt);
        this.$refs.outPaidPermission && this.$refs.outPaidPermission.setCheckedList(this.defaultCheckedListOutPaid);
        this.$refs.staffPermission && this.$refs.staffPermission.setCheckedList(this.defaultCheckedListStaff);
        this.$refs.salaryPermission && this.$refs.salaryPermission.setCheckedList(this.defaultCheckedListSalary);
      },
      setDefaultCheckedList(partCode) {
        const options = ['导入', '导出', '新增', '修改', '删除', '查看'];
        let tempList = [];
        this.binary(partCode, 6).split("").map((item, index) => {
          if (item === '1') {
            tempList.push(options[index])
          }
        });
        return tempList;
      },
      onPermissionClose() {
        this.permissionVisible = false;
      },
      handleDataEncoder(checkedList) {
        const options = ['导入', '导出', '新增', '修改', '删除', '查看'];
        let tempCode = [0, 0, 0, 0, 0, 0];
        options.map((item, index) => {
          tempCode[index] = checkedList.join('').indexOf(options[index]) < 0 ? 0 : 1;
        });
        return parseInt(tempCode.join(''), 2) < 10 ? String('0'+ parseInt(tempCode.join(''), 2)):(parseInt(tempCode.join(''), 2));
      },
      handlePermissionSubmit() {
        const block1 = this.handleDataEncoder(this.$refs.contractPermission.checkedList);
        const block2 = this.handleDataEncoder(this.$refs.subProjectPermission.checkedList);
        const block3 = this.handleDataEncoder(this.$refs.receiptPermission.checkedList);
        const block4 = this.handleDataEncoder(this.$refs.cashPermission.checkedList);
        const block5 = this.handleDataEncoder(this.$refs.outReceiptPermission.checkedList);
        const block6 = this.handleDataEncoder(this.$refs.outPaidPermission.checkedList);
        const block7 = this.handleDataEncoder(this.$refs.staffPermission.checkedList);
        const block8 = this.handleDataEncoder(this.$refs.salaryPermission.checkedList);

        const block = block1.toString() + block2.toString() + block3.toString() + block4.toString() +
          block5.toString() + block6.toString() + block7.toString() + block8.toString();
        const params = {
          userId: this.currentUserId,
          authorityCode: block,
        };
        this.verifyUser(params).then((res) => {
          if (res.data.meta.success) {
            this.$message.success('修改成功');
            this.editForm.resetFields();
            this.updateListData('first');
            this.permissionVisible = false;
          } else {
            this.$message.error(res.data.meta.message);
          }
        }).catch((error) => {
          this.$message.error(error);
        })
      },
    }
  }
</script>