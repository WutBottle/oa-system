<style scoped lang="scss">
  .StepsComponent {
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    -webkit-font-feature-settings: 'tnum';
    font-feature-settings: 'tnum';
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;

    .step-item {
      position: relative;
      display: inline-block;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      overflow: hidden;
      vertical-align: top;
      margin-right: 16px;

      .step-item-container {
        box-sizing: border-box;
        outline: none;

        .steps-item-icon {
          display: inline-block;
          width: 32px;
          height: 32px;
          margin-right: 8px;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
          line-height: 32px;
          text-align: center;
          border-radius: 32px;
          -webkit-transition: background-color 0.3s, border-color 0.3s;
          transition: background-color 0.3s, border-color 0.3s;

          .steps-icon {
          }

          &.wait {
            border: 1px solid rgba(0, 0, 0, 0.25);
            color: rgba(0, 0, 0, 0.25);
          }

          &.process {
            background: #1890ff;
            color: #fff;
          }

          &.error {
            border: 1px solid red;
            color: red;
          }

          &.finish {
            border: 1px solid #1890ff;
            color: #1890ff;
          }
        }
      }

      .steps-item-content {
        display: inline-block;
        vertical-align: top;

        .steps-item-title {
          font-weight: 500;
          position: relative;
          display: inline-block;
          padding-right: 16px;
          font-size: 16px;
          line-height: 32px;

          &.wait {
            color: rgba(0, 0, 0, 0.45);
          }

          &.progress {
            color: rgba(0, 0, 0, 0.85);
          }

          &.error {
            color: red;
          }

          &.finish {
            color: rgba(0, 0, 0, 0.65);
            &::after {
              background: #1890ff;
            }
          }

          &::after {
            position: absolute;
            top: 16px;
            left: 100%;
            display: block;
            width: 9999px;
            height: 1px;
            background: #e8e8e8;
            content: '';
          }
        }

      }

      &:last-child {
        flex: none;
        margin-right: 0;

        .steps-item-title {
          padding-right: 0;
        }

        .steps-item-title::after {
          width: 0;
        }
      }
    }
  }
</style>

<template>
  <div class="StepsComponent">
    <div class="step-item">
      <div class="step-item-container">
        <div :class="['steps-item-icon', this.classFilter(processStatus[0])]">
          <a-icon type="check" v-if="processStatus[0] === 2"/>
          <span v-else>1</span>
        </div>
        <div class="steps-item-content">
          <div :class="['steps-item-title', this.classFilter(processStatus[0])]">项目经理</div>
        </div>
      </div>
    </div>
    <div class="step-item">
      <div class="step-item-container" style="margin-bottom: 8px">
        <div :class="['steps-item-icon', this.classFilter(processStatus[1])]">
          <a-icon type="check" v-if="processStatus[1] === 2"/>
          <span v-else>2.1</span>
        </div>
        <div class="steps-item-content">
          <div :class="['steps-item-title', this.classFilter(processStatus[1])]">商务专员</div>
        </div>
      </div>
      <div class="step-item-container">
        <div :class="['steps-item-icon', this.classFilter(processStatus[2])]">
          <a-icon type="check" v-if="processStatus[2] === 2"/>
          <span v-else>2.2</span>
        </div>
        <div class="steps-item-content">
          <div :class="['steps-item-title', this.classFilter(processStatus[2])]">财务专员</div>
        </div>
      </div>
    </div>
    <div class="step-item">
      <div class="step-item-container">
        <div :class="['steps-item-icon', this.classFilter(processStatus[3])]">
          <a-icon type="check" v-if="processStatus[3] === 2"/>
          <span v-else>3</span>
        </div>
        <div class="steps-item-content">
          <div :class="['steps-item-title', this.classFilter(processStatus[3])]">项目经营负责人</div>
        </div>
      </div>
    </div>
    <div class="step-item">
      <div class="step-item-container">
        <div :class="['steps-item-icon', this.classFilter(processStatus[4])]">
          <a-icon type="check" v-if="processStatus[4] === 2"/>
          <span v-else>4</span>
        </div>
        <div class="steps-item-content">
          <div :class="['steps-item-title', this.classFilter(processStatus[4])]">部门经营负责人</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "StepsComponent",
    props: {
      processStatus: Array,
    },
    methods: {
      classFilter(type) {
        switch (type) {
          case 1:
            return 'process';
          case 2:
            return 'finish';
          case 3:
            return 'error';
          default:
            return 'wait';
        }
      }
    },
  }
</script>
