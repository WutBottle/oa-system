<style lang="scss" scoped>
  .OutPaidInput {
    padding-left: 24px;
  }
</style>

<template>
  <span class="OutPaidInput">
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
    name: "OutPaidInput",
    data() {
      return {
        fileList: [],
      }
    },
    methods: {
      ...mapActions({
        outPaidInput: 'outPaidOperation/outPaidInput',
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
          this.outPaidInput(formData).then((data) => {
              this.$notification.open({
                message: data.data.meta.success === true ? '外包回款添加成功' : '外包回款添加失败',
                duration: 10,
                icon: data.data.meta.success === true ? <a-icon type="check-circle" style="color: green" /> : <a-icon type="close-circle" style="color: red" />,
            });
          }).catch((error) => {
            console.log(error);
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