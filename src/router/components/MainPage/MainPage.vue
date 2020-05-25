<style lang="scss" scoped>
  .MainPage {
    height: auto;
    overflow-x: hidden;
    flex-flow: row;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;

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
      -ms-flex: 0 0 256px; /* 兼容IE */
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
      -ms-flex: 0 0 80px; /* 兼容IE */
      max-width: 80px;
      min-width: 80px;
      width: 80px;
    }

    .right-side {
      display: flex;
      display: -ms-flexbox; /* 兼容IE */
      flex: 1;
      -ms-flex: 1; /* 兼容IE */
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
                :openKeys="openKeys"
                @openChange="onOpenChange"
                :selectedKeys="[menuSelect]"
                mode="inline"
                theme="dark"
                :inlineCollapsed="collapsed"
                @select="handleSelect"
        >
          <template v-for="item in menuList">
            <a-menu-item v-if="!item.sideBars" :key="item.router">
              <a-icon :type="item.iconType"/>
              <span>{{item.name}}</span>
            </a-menu-item>
            <a-sub-menu v-else :key="item.name">
              <span slot="title"><a-icon :type="item.iconType"/><span>{{item.name}}</span></span>
              <template v-for="info in item.sideBars">
                <a-menu-item :key="info.router">{{info.name}}</a-menu-item>
              </template>
            </a-sub-menu>
          </template>
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
                <!--                <span class="action">-->
                <!--                  <a-badge count="12">-->
                <!--                    <a-icon type="bell"/>-->
                <!--                  </a-badge>-->
                <!--                </span>-->
                <a-dropdown plcement="bottomRight">
                <span class="action">
                  <span class="avatar">
                    <img :src="avatarSetting[role]" alt="avatar">
                  </span>
                  <span>{{this.username}}</span>
                </span>
                  <a-menu slot="overlay">
                    <!--                    <a-menu-item key="0">-->
                    <!--                      <a @click="() => {this.$router.push('/main/usercenter')}">-->
                    <!--                        <a-icon type="user" style="margin-right: 8px"/>-->
                    <!--                        <span>个人中心</span>-->
                    <!--                      </a>-->
                    <!--                    </a-menu-item>-->
                    <!--                    <a-menu-item key="1">-->
                    <!--                      <a @click="() => {this.$router.push('/main/setting')}">-->
                    <!--                        <a-icon type="setting" style="margin-right: 8px"/>-->
                    <!--                        <span>账户设置</span>-->
                    <!--                      </a>-->
                    <!--                    </a-menu-item>-->
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
  import {mapState, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'MainPage',
    mounted() {
      this.generateMenuList();
      Promise.all([
        this.handleUpdateCategory(1),
        this.handleUpdateCategory(2),
        this.handleUpdateCategory(3),
        this.handleUpdateCategory(4),
        this.handleUpdateCategory(5),
        this.handleUpdateCategory(6),
        this.handleUpdateCategory(7),
        this.handleUpdateCategory(8),
        this.handleUpdateCategory(9),
        this.handleUpdateCategory(10),
        this.handleUpdateCategory(11),
      ]).then(() => {
      });
      this.screenWidth = document.body.clientWidth;
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth;
          this.collapsed = this.screenWidth <= 1024;
        })();
      };
    },
    data() {
      return {
        screenWidth: '',
        collapsed: false,
        openKeys: [],
        rootSubmenuKeys: ['数据录入', '系统管理'],
        menuList: [],
        avatarSetting: {
          部门负责人: require('@/assets/总监.png'),
          超级管理员: require('@/assets/超级管理员.png'),
          普通用户: require('@/assets/普通用户.png'),
        },
      }
    },
    watch: {
      '$route': function (to, from) {
        this.setMenu(to.path);
      }
    },
    created() {
      this.setMenu(this.$route.path);
    },
    computed: {
      ...mapState({
        username: state => state.tokensOperation.username,// 选择合同数
        role: state => state.tokensOperation.role,
        menuSelect: state => state.tokensOperation.menuSelect, // 当前menu
      }),
    },
    methods: {
      ...mapMutations({
        setMenu: 'tokensOperation/setMenu',
      }),
      ...mapActions({
        logout: 'tokensOperation/logout',
        getCategoryList: 'categoryOperation/getCategoryList',
      }),
      handleUpdateCategory(type) {
        return new Promise((resolve, reject) => {
          this.getCategoryList({
            categoryType: type,
          }).then((res) => {
            resolve(res)
          }).catch(error => {
            reject(error);
          })
        })
      },
      generateMenuList() {
        const commonMenuList =
          [{
            name: '工作台',
            router: "/main/workplace",
            iconType: "desktop",
          },
            {
              name: '项目列表',
              router: "/main/project",
              iconType: "table",
            },
            {
              name: '现金发票',
              router: "/main/receipt",
              iconType: "snippets",
            },
            {
              name: '分包列表',
              router: "/main/outcontractlist",
              iconType: "layout",
            }, {
            name: '审批管理',
            router: "/main/approvalmanagement",
            iconType: "edit",
          }];
        const inputMenuList =
          {
            name: "数据管理",
            iconType: "file-text",
            sideBars: [
              {
                name: "合同管理",
                router: "/main/contractmanager",
              },
              {
                name: "合同发票管理",
                router: "/main/invoice",
              },
              {
                name: "合同现金管理",
                router: "/main/cash",
              },
              {
                name: "分项分包管理",
                router: "/main/subentry",
              },
              {
                name: "分包发票管理",
                router: "/main/outcontractreceipt",
              },
              {
                name: "分包付款管理",
                router: "/main/outcontractpaid",
              }]
          };

        if (this.role === '超级管理员' || this.role === '部门负责人') {
          commonMenuList.push({
            name: '职员列表',
            router: "/main/staff",
            iconType: "team",
          });
          inputMenuList.sideBars.push({
            name: "职员管理",
            router: "/main/staffentry",
          });
          inputMenuList.sideBars.push({
            name: "工资管理",
            router: "/main/salaryentry",
          });
          const adminMenu = [
            {
              name: '项目导出',
              iconType: 'export',
              router: "/main/projectexport",
            }, {
              name: "系统管理",
              iconType: "cluster",
              sideBars: [
                {
                  name: "参数配置",
                  router: "/main/parameter",
                },
                {
                  name: "用户管理",
                  router: "/main/users",
                }
              ]
            }];
          this.menuList = this.menuList.concat(commonMenuList).concat(inputMenuList).concat(adminMenu);
        } else {
          this.menuList = this.menuList.concat(commonMenuList).concat(inputMenuList);
        }
      },
      toggleCollapsed() {
        this.collapsed = !this.collapsed
      },
      handleSelect(key, keyPath) {
        this.$router.push(key.key);
        this.setMenu(key.key);
      },
      handleLogout() {
        this.logout().then(() => {
          this.$message.success('已退出');
          this.$router.push('/user/login');
        })
      },
      onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.openKeys = openKeys;
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
      },
    }
  }
</script>

