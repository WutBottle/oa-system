<style lang="scss" scoped>
  .SalaryEntryPage {
    .page-content {
      padding: 30px;

      .form-wrapper {
        margin-bottom: 18px;
      }
    }
  }
</style>

<template>
  <div class="SalaryEntryPage">
    <HeaderPage title="工资录入"/>
    <div class="page-content">
      <a-row style="background-color: #fff; padding: 24px;">
      </a-row>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";

  export default {
    name: "SalaryEntryPage",
    components: {
      HeaderPage,
    }
  }
</script>