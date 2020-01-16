<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .hello {

  }
</style>

<template>
  <div class="main-wrapper">
    <a-button type="primary">Primary</a-button>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    }
  }
</script>

