<style lang="scss" scoped>
  .Bar {
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="Bar" ref='barChart'></div>
</template>

<script>
  export default {
    name: "Bar",
    props:{
      wrapperId: {
        type: String,
      },
    },
    methods: {
      drawBar(options) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.barChart);
        // 绘制图表
        myChart.setOption(options);
        this.addResizeListener();
      },
      addResizeListener() {
        let elementResizeDetectorMaker = require("element-resize-detector");
        let erd = elementResizeDetectorMaker();
        erd.listenTo(document.getElementById(this.wrapperId), (element) => {
          this.$echarts.init(this.$refs.barChart).resize()
        });
      },
    }
  }
</script>