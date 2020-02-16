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
        <a-tabs hideAdd v-model="activeKey" type="editable-card" @edit="onEdit">
          <a-tab-pane v-for="pane in panes" :tab="pane.title" :key="pane.key" :closable="pane.closable">
            <ProjectListPage @handleContractOpen="handleContractOpen" v-if="pane.title === '项目列表'"/>
            <ContractListPage :contractId="pane.contractId" v-else/>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  import HeaderPage from "../HeaderPage/HeaderPage";
  import ContractListPage from "./ContractListPage/ContractListPage";
  import ProjectListPage from "./ProjectListPage/ProjectListPage";

  export default {
    name: "ListPage",
    components: {
      HeaderPage,
      ContractListPage,
      ProjectListPage
    },
    data() {
      const panes = [
        {title: '项目列表', key: '1', closable: false},
      ];
      return {
        activeKey: panes[0].key,
        panes,
        newTabIndex: 0,
      };
    },
    mounted() {
      this.getProjectCategoryList();
    },
    methods: {
      ...mapActions({
        getProjectCategoryList: 'projectCategoryOperation/getProjectCategoryList',
      }),
      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      add(contractId) {
        const panes = this.panes;
        if (panes.find(item => {
          return item.title === `合同${contractId}详情`
        })){
          this.activeKey = panes[panes.findIndex(item => {
            return item.contractId === contractId
          })].key;
        } else {
          const activeKey = `newTab${this.newTabIndex++}`;
          panes.push({
            title: `合同${contractId}详情`,
            contractId: contractId,
            key: activeKey,
          });
          this.panes = panes;
          this.activeKey = activeKey;
        }
      },
      remove(targetKey) {
        let activeKey = this.activeKey;
        let lastIndex;
        this.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }
        this.panes = panes;
        this.activeKey = activeKey;
      },
      handleContractOpen(value) {
        this.add(value);
      }
    }
  }
</script>