<style lang="scss" scoped>
  .MainPage {
    height: auto;
    overflow-x: hidden;
    display: -webkit-box;
    flex-flow: row;

    .dark {
      background: #001529;
      box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    }

    .left-side-layout {
      position: relative;
      z-index: 106;
      min-height: 100vh;
    }

    .left-side, .left-side-collapsed {
      flex: 0 0 256px;
      max-width: 256px;
      min-width: 256px;
      width: 256px;
      transition: all .3s;

      .side-children {
        height: 100%;
        overflow-y: hidden;

        .logo {
          position: relative;
          height: 64px;
          padding-left: 24px;
          overflow: hidden;
          line-height: 64px;
          background: #002140;

          .logo-img {
            display: inline-block;
            vertical-align: middle;
            width: 32px;
            height: 32px;
            overflow: hidden;
            background: url('~@/assets/OA.png') no-repeat top left;
            background-size: cover;
          }

          h1 {
            display: inline-block;
            color: #fff;
            font-size: 20px;
            margin: 0 0 0 16px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            font-weight: 600;
            vertical-align: middle;
          }
        }
      }
    }

    .left-side-collapsed {
      flex: 0 0 80px;
      max-width: 80px;
      min-width: 80px;
      width: 80px;
    }

    .right-side {
      display: flex;
      flex: 1;
      padding-left: 0;
      min-height: 100vh;
      background: #f0f2f5;
      flex-direction: column;

      .header-wrapper {
        position: relative;
        z-index: 105;

        .header-layout {
          height: 64px;
          padding: 0;
          line-height: 64px;
          background: #001529;

          .header {
            height: 64px;
            padding: 0 12px 0 0;
            background: #fff;
            -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
            box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
            position: relative;

            .icon {
              font-size: 20px;
              line-height: 64px;
              padding: 0 24px;
              cursor: pointer;
              transition: color .3s;

              &:hover {
                background: rgba(0, 0, 0, .025);
              }
            }

            .user-wrapper {
              float: right;
              height: 100%;

              .content-box {
                .action {
                  cursor: pointer;
                  padding: 0 12px;
                  display: inline-block;
                  transition: all .3s;
                  height: 100%;
                  color: rgba(0, 0, 0, .65);

                  .avatar {
                    margin-right: 6px;
                    color: #1890ff;
                    background: hsla(0, 0%, 100%, .85);
                    vertical-align: middle;
                    width: 24px;
                    height: 24px;
                    line-height: 24px;
                    border-radius: 50%;
                    white-space: nowrap;
                    text-align: center;
                    display: inline-block;
                    overflow: hidden;

                    img {
                      display: block;
                      width: 100%;
                      height: 100%;
                    }
                  }

                  i {
                    font-size: 16px;
                    padding: 4px;
                  }

                  &:hover {
                    background: rgba(0, 0, 0, .025);
                  }
                }
              }
            }
          }
        }
      }

      .content {
        height: 100%;
        background-color: #f0f2f5;
      }

      .footer {
        font-size: 14px;
        color: rgba(0, 0, 0, .45);
        padding: 24px 48px 34px 48px;
        text-align: center;
        background-color: #f0f2f5;
      }
    }
  }
</style>

<template>
  <div class="MainPage">
    <div v-bind:class="['dark', 'left-side-layout', collapsed ? 'left-side-collapsed' : 'left-side']">
      <div class="side-children">
        <div class="logo">
          <a href="/main">
            <div class="logo-img"></div>
            <h1>CSADI OA Pro</h1>
          </a>
        </div>
        <a-menu
                :defaultSelectedKeys="[menuDefault]"
                mode="inline"
                theme="dark"
                :inlineCollapsed="collapsed"
                @select="handleSelect"
        >
          <a-menu-item key="/main/workplace">
            <a-icon type="desktop"/>
            <span>工作台</span>
          </a-menu-item>
          <a-menu-item key="/main/list">
            <a-icon type="table"/>
            <span>合同列表</span>
          </a-menu-item>
          <a-menu-item key="/main/analysis">
            <a-icon type="pie-chart"/>
            <span>分析中心</span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="user"/><span>个人页</span></span>
            <a-menu-item key="/main/usercenter">个人中心</a-menu-item>
            <a-menu-item key="/main/setting">个人设置</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
    </div>
    <div class="right-side">
      <div class="header-wrapper">
        <div class="header-layout">
          <div class="header">
            <a-icon class="icon" @click="toggleCollapsed" :type="collapsed ? 'menu-unfold' : 'menu-fold'"/>
            <div class="user-wrapper">
              <div class="content-box">
                <span class="action">
                  <a-badge count="12">
                    <a-icon type="bell"/>
                  </a-badge>
                </span>
                <a-dropdown plcement="bottomRight">
                <span class="action">
                  <span class="avatar">
                    <img src="@/assets/OA.png" alt="avatar">
                  </span>
                  <span>{{this.username}}</span>
                </span>
                  <a-menu slot="overlay">
                    <a-menu-item key="0">
                      <a href="/main">
                        <a-icon type="user" style="margin-right: 8px"/>
                        <span>个人中心</span>
                      </a>
                    </a-menu-item>
                    <a-menu-item key="1">
                      <a href="/main">
                        <a-icon type="setting" style="margin-right: 8px"/>
                        <span>账户设置</span>
                      </a>
                    </a-menu-item>
                    <a-menu-divider/>
                    <a-menu-item key="3">
                      <a @click="handleLogout">
                        <a-icon type="logout" style="margin-right: 8px"/>
                        <span>退出登录</span>
                      </a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
      <div class="footer">
        Copyright © 2020 芃芃金服体验技术部出品
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'MainPage',
    props: {
      msg: String
    },
    data() {
      return {
        collapsed: false,
        menuDefault: '',
      }
    },
    created() {
      this.menuDefault = this.$route.path
    },
    computed: {
      ...mapState({
        username: state => state.userOperation.username,// 选择合同数
      }),
    },
    methods: {
      ...mapActions({
        logout: 'userOperation/logout',
      }),
      toggleCollapsed() {
        this.collapsed = !this.collapsed
      },
      handleSelect(key, keyPath) {
        this.$router.push(key.key);
      },
      handleLogout() {
        this.logout().then((data) => {
          this.$message.success('已退出');
          this.$router.push('/');
        }).catch((error) => {
          this.$message.error(error);
        });
      },
    }
  }
</script>

