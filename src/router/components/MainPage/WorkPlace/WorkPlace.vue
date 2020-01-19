<style lang="scss" scoped>
  .WorkPlace {
    .page-header {
      background: #fff;
      padding: 16px 32px 0;
      border-bottom: 1px solid #e8e8e8;

      .bread {
        margin-bottom: 16px;
      }

      .detail {
        display: flex;
        width: 100%;

        .avatar {
          margin: 0 20px 16px 0;

          span {
            border-radius: 50%;
            display: block;
            width: 72px;
            height: 72px;
            line-height: 72px;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .content {
          flex: auto;
          color: rgba(0, 0, 0, .45);
          line-height: 22px;

          .title {
            font-size: 20px;
            line-height: 28px;
            font-weight: 500;
            color: rgba(0, 0, 0, .85);
            margin-bottom: 16px;
            flex: auto;
          }
        }

        .extra {
          flex: 0 1 auto;
          margin-left: 88px;
          min-width: 242px;
          text-align: left;
          width: 375px;

          .info {
            padding: 0 32px 0 0;
          }

          .title {
            color: rgba(0, 0, 0, .45);
            font-size: 14px;
            line-height: 22px;
            margin-bottom: 4px;
          }

          .count {
            color: rgba(0, 0, 0, .85);
            font-size: 24px;
            line-height: 32px;
            margin: 0;
          }
        }
      }
    }

    .page-content {
      padding: 24px;

      .project-doing {
        margin-bottom: 24px;
      }
    }
  }
</style>

<template>
  <div class="WorkPlace">
    <div class="page-header">
      <a-breadcrumb class="bread">
        <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
        <a-breadcrumb-item>工作台</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="detail">
        <div class="avatar">
          <span>
            <img src="@/assets/OA.png" alt="avatar">
          </span>
        </div>
        <div class="content">
          <div class="title">
            晚上好，{{userName}}，天气冷了要加衣服！
          </div>
          <div>
            建筑院院长 | CSADI - 某某某项目组 - OA平台
          </div>
        </div>
        <div class="extra">
          <a-row>
            <a-col :span="8">
              <div class="info">
                <div class="title">合同</div>
                <div class="count">56</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info">
                <div class="title">团队排名</div>
                <div class="count">8/24</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info">
                <div class="title">合同总数</div>
                <div class="count">2232</div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <div class="page-content">
      <a-row :gutter="20">
        <a-col :span="16">
          <div class="project-doing">
            <a-card title="进行中的合同" :bordered="false">
              <a href="#" slot="extra">全部合同</a>
              <a-card-grid style="width:33.33%;textAlign:'center'">Content</a-card-grid>
              <a-card-grid style="width:33.33%;textAlign:'center'">Content</a-card-grid>
              <a-card-grid style="width:33.33%;textAlign:'center'">Content</a-card-grid>
              <a-card-grid style="width:33.33%;textAlign:'center'">Content</a-card-grid>
              <a-card-grid style="width:33.33%;textAlign:'center'">Content</a-card-grid>
              <a-card-grid style="width:33.33%;textAlign:'center'">Content</a-card-grid>
            </a-card>
          </div>
          <div class="dynamic-wrapper">
            <a-card title="动态" :bordered="false">
              <a-list
                      itemLayout="horizontal"
                      :dataSource="data"
              >
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-list-item-meta
                          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  >
                    <a slot="title" href="https://vue.ant.design/">{{item.title}}</a>
                    <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="chart-wrapper">
            <a-card title="xx指数" :bordered="false">
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "WorkPlace",
    data() {
      return {
        userName: 'huang',
        data: [
          {
            title: 'Ant Design Title 1',
          },
          {
            title: 'Ant Design Title 2',
          },
          {
            title: 'Ant Design Title 3',
          },
          {
            title: 'Ant Design Title 4',
          },
        ]
      }
    }
  }
</script>
