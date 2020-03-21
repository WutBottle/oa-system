<style lang="scss" scoped>
  .ContractManager {
    .page-content {
      padding: 24px;
    }
  }
</style>

<template>
  <div class="ContractManager">
    <HeaderPage title="合同管理"/>
    <div class="page-content">
      <div style="background-color: #fff;padding: 24px 24px;">
        <ContractListPage @showAddModal="showAddModal" ref="contractListDom"/>
      </div>
    </div>
    <a-modal title="添加合同"
             v-model="contractAddVisible"
             width="80vw"
             :footer="null">
      <a-tabs :animated="false" defaultActiveKey="1">
        <a-tab-pane tab="主合同" key="1">
          <MainContractManager @updateContractTableData="updateContractTableData"/>
        </a-tab-pane>
        <a-tab-pane tab="补充合同" key="2">
          <SubContractManager @updateContractTableData="updateContractTableData"/>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
  import HeaderPage from "../HeaderPage/HeaderPage";
  import MainContractManager from "./MainContractManager/MainContractManager";
  import SubContractManager from "./SubContractManager/SubContractManager";
  import ContractListPage from "./ContractListPage/ContractListPage";

  export default {
    name: "contractManager",
    components: {
      HeaderPage,
      MainContractManager,
      SubContractManager,
      ContractListPage,
    },
    data() {
      return {
        contractAddVisible: false,
      }
    },
    methods:{
      showAddModal() {
        this.contractAddVisible = true;
      },
      updateContractTableData() {
        this.$refs.contractListDom.updateTableData();
      }
    }
  }
</script>