<style lang="scss" scoped>
  .ListPage {
    .page-content {
      padding: 24px;

    }
  }
</style>

<template>
  <div class="ListPage">
    <HeaderPage title="项目列表"/>
    <div class="page-content">
      <div style="background-color: #fff;padding: 24px">
        <ProjectListPage/>
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderPage from "../HeaderPage/HeaderPage";
  import ProjectListPage from "./ProjectListPage/ProjectListPage";

  export default {
    name: "ListPage",
    components: {
      HeaderPage,
      ProjectListPage
    },
    data() {
      return {

      }
    },
    methods: {}
  }
</script>