<style scoped lang="scss">
  .HelpPage {
    padding: 24px;

    .help-wrapper {
      background-color: white;
      padding: 30px 220px 30px 60px;
    }
  }
</style>

<template>
  <div class="HelpPage">
    <a-affix :style="{ position: 'fixed', top: '120px', right: '70px'}">
      <a-anchor :target-offset="targetOffset">
        <a-anchor-link href="#anchor1" title="人员录入"/>
        <a-anchor-link href="#anchor2" title="项目录入与管理"/>
        <a-anchor-link href="#anchor3" title="发票现金回款录入管理"/>
      </a-anchor>
    </a-affix>
    <div class="help-wrapper">
      <div id="anchor1">
        <h1>一、人员录入</h1>
        <h2>● 使用<b>管理员</b>账号登入系统</h2>
        <h2>● 选择左侧功能栏中的<b>数据管理</b>中的<b>职员管理</b></h2>
        <h2>● 点击列表上方的<b>新增</b></h2>
        <h2>● 输入职员基本信息后提交表单</h2>
        <h2>● 选择左侧功能栏中的<b>用户管理</b></h2>
        <h2>● 点击列表上方的新增</h2>
        <h2>● 输入用户基本信息，其中<b>职员名称</b>一栏中选择<b>对应的职员</b></h2>
        <h2>● 人员录入完成</h2>
        <h2>● 选择左侧功能栏中的<b>数据管理</b>的<b>职员管理</b>即可对现有成员数据进行管理</h2>
      </div>
      <a-divider/>
      <div id="anchor2">
        <h1>二、项目录入与管理</h1>
        <h2>● 使用<b>普通用户</b>账户或者管理员账户登入系统</h2>
        <h2>● 选择左侧功能栏中的<b>数据管理</b>中的<b>合同管理</b></h2>
        <h2>● 点击列表上方的<b>新增</b></h2>
        <h2>● 手动输入合同信息或通过excel表格添加合同(点击或拖拽excel文件导入)</h2>
        <h2>● 情况1：如果是<b>管理员</b>添加合同，可在初始或后续在合同管理页面添加对应管理人员</h2>
        <h2>● 情况2：如果是<b>普通用户</b>(商务专员)添加合同，在添加合同时在<b>商务专员</b>一栏<b>添加自己的信息</b></h2>
        <h2>● 项目录入完成在<b>功能栏左侧</b>的<b>项目列表</b>中查看</h2>
        <h2>● 列表最右侧的<b>项目操作</b>，点击查看可浏览项目状况，点开项目详情后，点击<b>合同总额</b>可查看该项目中的所有合同，点击展开的<b>合同(带下划线）</b>可打开上传的PDF文档</h2>
        <h2>● 点击<b>累计开票</b>与<b>累计收费</b>可展开合同的发票详情与现金详情</h2>
        <h2>● 点击项目生产中的<b>专业/专项</b>项可展开<b>分包合同信息</b></h2>
        <h2>● 列表最右侧的<b>管理</b>操作，可直接进入<b>合同管理</b>界面对合同信息进行修改</h2>
      </div>
      <a-divider/>
      <div id="anchor3">
        <h1>三、发票与现金回款录入管理</h1>
        <h2>● 使用普通用户登入系统</h2>
        <h2>● 方法1：选择左侧功能栏中的<b>数据管理</b>中的<b>合同现金管理</b>或<b>合同发票管理</b></h2>
        <h2>● <b>搜索合同号</b>或者<b>合同名称</b>进入对应列表</h2>
        <h2>● 方法2：如果该合同下<b>已经有</b>对应发票现金数据，选择左侧功能栏中的<b>现金发票</b>列表，搜索对应合同号，点击列表最右侧<b>管理</b>按钮进入管理界面</h2>
        <h2>● 进入管理界面后，选择最上方<b>一键导入</b>可通过excel文件直接导入，或点击下方<b>新增</b>按钮手动输入现金发票信息</h2>
        <h2>● 现金发票信息添加完成，可点击<b>左侧现金发票</b>查看</h2>
        <h2>● 管理方法与添加方法<b>类似</b></h2>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HelpPage",
    data() {
      return {
        targetOffset: undefined,
      };
    },
    mounted() {
      this.targetOffset = window.innerHeight / 2;
    },
  }
</script>

