<style lang="scss" scoped>
  .ContractManager {
    .page-content {
      padding: 24px;
    }
  }
</style>

<template>
  <div class="ContractManager">
    <HeaderPage title="合同录入"/>
    <div class="page-content">
      <div style="background-color: #fff;padding: 8px 24px;">
        <a-tabs :animated="false" defaultActiveKey="1">
          <a-tab-pane tab="主合同" key="1">
            <MainContractManager/>
          </a-tab-pane>
          <a-tab-pane tab="补充合同" key="2">
            <SubContractManager/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderPage from "../HeaderPage/HeaderPage";
  import MainContractManager from "./MainContractManager/MainContractManager";
  import SubContractManager from "./SubContractManager/SubContractManager";
  export default {
    name: "contractManager",
    components: {
      HeaderPage,
      MainContractManager,
      SubContractManager,
    },
  }
</script>