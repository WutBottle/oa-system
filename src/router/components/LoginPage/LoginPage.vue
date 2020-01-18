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
      top: 100px;
      margin-left: -190px;
      .logo {
        width: 100px;
        height: 100px;
        background:url('~@/assets/OA.png') no-repeat top left;
        background-size: cover;
      }

      .logo-title {
        font-size: 40px;
        font-weight: bold;
        font-family: "Myriad Pro",serif;
      }

      .logo,.logo-title {
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
  }
</style>

<template>
  <div class="LoginPage">
    <div class="header-wrapper">
      <div class="logo"></div>
      <div class="logo-title">OA System Pro</div>
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
  export default {
    name: 'LoginPage',
    props: {
      msg: String
    },
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    methods: {
      handleSubmit (e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            localStorage.setItem('token', '1');
            this.$router.push('/main');
            this.$message.success('登录成功');
          }
        });
      },
    },
  }
</script>

