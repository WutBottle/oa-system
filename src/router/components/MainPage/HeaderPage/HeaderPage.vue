<style lang="scss" scoped>
  .HeaderPage {
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
</style>

<template>
  <div class="HeaderPage">
    <a-breadcrumb class="bread">
      <a-breadcrumb-item><a href="/main/workplace">首页</a></a-breadcrumb-item>
      <a-breadcrumb-item>{{title}}</a-breadcrumb-item>
    </a-breadcrumb>
    <p class="title">{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: "HeaderPage",
    props: {
      title: {
        type: String,
        default: () => {}
      },
    }
  }
</script>