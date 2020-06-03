<style lang="scss" scoped>
  .CashReceiptInput {
    padding-left: 24px;
  }
</style>

<template>
  <span class="CashReceiptInput">
    <a-upload
            :multiple="false" :fileList="fileList" :remove="handleExcelRemove"
            :beforeUpload="beforeUploadXls"
    >
      <a-button> <a-icon type="upload" />一键导入</a-button>
    </a-upload>
  </span>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: "CashReceiptInput",
    props: {
      type: String,
    },
    data() {
      return {
        fileList: [],
      }
    },
    methods: {
      ...mapActions({
        cashInput: 'cashOperation/cashInput',
        receiptInput: 'receiptOperation/receiptInput',
      }),
      handleExcelRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      },
      beforeUploadXls(file) {
        this.handleExcelRemove(file);
        const suffix = file.name.split('.').reverse()[0];
        if (suffix === 'xls' || suffix === 'xlsx') {
          const formData = new FormData();
          this.fileList = [...this.fileList, file];
          this.fileList.forEach((file) => {
            formData.append('multipartFiles', file);
          });
          const uploadFunction = this.type === 'cash' ? this.cashInput : this.receiptInput;
          // 手动上传
          uploadFunction(formData).then((data) => {
            const params = Object.keys(data.data.data)[0];
            for (let i = 0; i < data.data.data[params].length; i++) {
              this.$notification.open({
                message: data.data.data[params][i],
                duration: 10,
                icon: data.data.data[params][i].indexOf('添加成功') != -1 ? <a-icon type="check-circle" style="color: green" /> : <a-icon type="close-circle" style="color: red" />,
            })
            }
          }).catch((error) => {
            this.$message.error('上传失败');
          });
        } else {
          this.$message.error('只能上传.xls或者.xlsx文件类型');
          this.handleExcelRemove(file);
        }
        return false;
      },

    }
  }
</script>