<style lang="scss" scoped>
  .OutContractInput {
    padding-left: 24px;
  }
</style>

<template>
  <span class="OutContractInput">
    <a-upload
            :multiple="false" :fileList="fileList" :remove="handleRemove"
            :beforeUpload="beforeUpload"
    >
      <a-button> <a-icon type="upload" />一键导入</a-button>
    </a-upload>
  </span>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: "OutContractInput",
    data() {
      return {
        fileList: [],
      }
    },
    methods: {
      ...mapActions({
        outContractInput: 'outContractOperation/outContractInput',
      }),
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      },
      beforeUpload(file) {
        this.handleRemove(file);
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
          const formData = new FormData();
          this.fileList = [...this.fileList, file];
          this.fileList.forEach((file) => {
            formData.append('multipartFiles', file);
          });
          // 手动上传
          this.outContractInput(formData).then((data) => {
            for (let i = 0; i < data.data.data.length; i++) {
              this.$notification.open({
                message: data.data.data[i],
                duration: 10,
                icon: data.data.data[i].indexOf('添加成功') != -1 ? <a-icon type="check-circle" style="color: green" /> : <a-icon type="close-circle" style="color: red" />,
            });
            }
          }).catch((error) => {
            this.$message.error('上传失败');
          });
        } else {
          this.$message.error('只能上传.xls或者.xlsx文件类型');
          this.handleRemove(file);
        }
        return false;
      },

    }
  }
</script>