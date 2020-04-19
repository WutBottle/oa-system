/* 使用sass的时候讲lang改为scss，若是sass则严格限制不能使用大括号，不方便编写代码 */
<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>

<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  export default {
    name: 'App',
    data() {
      return {
        locale: zhCN,
      };
    },
  }
</script>
