<style lang="scss" scoped>
  .PermissionComponent {

  }
</style>

<template>
  <div class="PermissionComponent">
    {{title}}：
    <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll">
      全选
    </a-checkbox>
    <a-checkbox-group :options="options" v-model="checkedList" @change="onChange" />
  </div>
</template>

<script>
  export default {
    name: "PermissionComponent",
    props: {
      title: {
        type: String,
        default: () => '',
      },
      defaultCheckedList: {
        type: Array,
        default: () => [],
      }
    },
    data() {
      return {
        options: ['导入', '导出', '新增', '修改', '删除', '查看'],
        indeterminate: true,
        checkAll: false,
        checkedList: [],
      }
    },
    mounted() {
      this.checkedList = this.defaultCheckedList;
    },
    methods: {
      onChange(checkedList) {
        this.indeterminate = !!checkedList.length && checkedList.length < this.options.length;
        this.checkAll = checkedList.length === this.options.length;
      },
      onCheckAllChange(e) {
        Object.assign(this, {
          checkedList: e.target.checked ? this.options : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
      },
      setCheckedList(data) {
        this.checkedList = data;
      }
    }
  }
</script>
