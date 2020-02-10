<style lang="scss" scoped>
  .LoginPage {
    background-color: #F0F3F7;
    min-height: 100vh;
    text-align: center;

    .header-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 50%;
      top: 110px;
      margin-left: -150px;

      .logo {
        width: 44px;
        height: 44px;
        background: url('~@/assets/OA.png') no-repeat top left;
        background-size: cover;
      }

      .logo-title {
        margin-left: 12px;
        font-size: 40px;
        font-weight: bold;
        font-family: "Myriad Pro", serif;
      }

      .logo, .logo-title {
        display: inline-block;
      }
    }

    .login-wrapper {
      display: inline-block;
      width: 370px;
      margin-top: 220px;
      text-align: left;

      #components-form-demo-normal-login .login-form {
        max-width: 300px;
      }

      #components-form-demo-normal-login .login-form-forgot {
        float: right;
      }

      #components-form-demo-normal-login .login-form-button {
        width: 100%;
      }
    }

    .copyright-wrapper {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      font-size: 14px;
      color: rgba(0,0,0,.45);
    }
  }
</style>

<template>
  <div class="LoginPage">
    <div class="header-wrapper">
      <div class="logo"></div>
      <div class="logo-title">CSADI OA Pro</div>
    </div>
    <div class="login-wrapper">
      <a-form
              id="components-form-demo-normal-login"
              :form="form"
              class="login-form"
              @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
                  size="large"
                  v-decorator="[
          'userName',
          { rules: [{ required: true, message: '请输入账户名!' }] }
        ]"
                  placeholder="账户"
          >
            <a-icon
                    slot="prefix"
                    type="user"
                    style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
                  size="large"
                  v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码!' }] }
        ]"
                  type="password"
                  placeholder="密码"
          >
            <a-icon
                    slot="prefix"
                    type="lock"
                    style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
                  v-decorator="[
          'auto',
          {
            valuePropName: 'checked',
            initialValue: true,
          }
        ]"
          >
            自动登录
          </a-checkbox>
          <a
                  class="login-form-forgot"
                  href=""
          >
            忘记密码
          </a>
          <a-button
                  type="primary"
                  html-type="submit"
                  class="login-form-button"
          >
            登录
          </a-button>
          Or <a href="">
          register now!
        </a>
        </a-form-item>
      </a-form>
    </div>
    <div class="copyright-wrapper">Copyright © 2020 芃芃金服体验技术部出品</div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'LoginPage',
    props: {
      msg: String
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);
    },
    computed: {
      ...mapState({
        loginStatus: state => state.tokensOperation.status,//登录状态记录
      }),
    },
    methods: {
      ...mapActions({
        login: 'tokensOperation/login',
      }),
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            this.login({
              password: values.password,
              username: values.userName,
            }).then((data) => {
              if (data.data.meta.success) {
                this.$router.push('/main/workplace');
                this.$message.success('登录成功');
              } else {
                this.$message.error(data.data.meta.message);
              }
            }).catch((error) => {
              this.$message.error('网络错误');
            });
          }
        });
      },
    },
  }
</script>

