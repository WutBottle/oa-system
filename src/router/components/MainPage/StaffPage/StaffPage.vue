<style lang="scss" scoped>
  .StaffPage {
    .page-content {
      padding: 24px;

      .form-wrapper {
        margin-bottom: 18px;
      }
    }
  }
</style>

<template>
  <div class="StaffPage">
    <HeaderPage title="职员列表"/>
    <div class="page-content">
      <a-row style="background-color: #fff; padding: 24px;">
        <a-form class="form-wrapper" :layout="formLayout">
          <a-form-item
                  label="查询关键词"
          >
            <a-input style="width: 120px" v-model="staffName" placeholder="姓名、工号"/>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleQuery">
              查询
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-popover title="项目选择列表" placement="bottom" trigger="click" v-model="popVisible">
              <template slot="content">
                <div v-if="!!selectStaffInfo.length" style="width: 350px">
                  <template v-for="(item, index) in selectStaffInfo">
                    <div :key="index">
                      <span>{{index + 1}}</span>
                      <a-divider type="vertical"/>
                      <span>{{item.staffCode}}</span>
                      <a-divider type="vertical"/>
                      <span>{{item.staffName}}</span>
                    </div>
                  </template>
                </div>
                <a-empty v-else/>
              </template>
              <a-button type="dashed" @click="() => this.popVisible = true">
                选择列表
              </a-button>
            </a-popover>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleStaffExport">
              导出
            </a-button>
          </a-form-item>
        </a-form>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="staffColumns" :dataSource="staffTableData"
                     :pagination="staffPaginationProps"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect: onSelect, onSelectAll: onSelectAll, onChange: onSelectChange}"
                     @change="handleStaffTableChange" :scroll="{ x: 3070, y: 500}">
               <span slot="serial" slot-scope="text, record, index">
                {{ index + 1 }}
              </span>
              <span slot="operation" slot-scope="text, record">
                    <a @click="openSalary(record)">查看</a>
              </span>
              <a-button slot="export" slot-scope="text, record" type="primary" @click="handleSalaryExport(record)">导出
              </a-button>
            </a-table>
          </a-spin>
        </div>
      </a-row>
    </div>
    <a-modal
            :title="currentStaffName + '工资详情'"
            v-model="salaryVisible"
            width="700px"
            :footer="null"
    >
      <a-spin :spinning="salaryTableSpinning">
        <a-table bordered :columns="salaryColumns" :dataSource="salaryTableData"
                 :pagination="salaryPaginationProps"
                 @change="handleSalaryTableChange" :scroll="{ y: 500}">
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
        </a-table>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";
  import moment from 'moment';

  const formLayout = 'inline';
  export default {
    name: "StaffPage",
    components: {
      HeaderPage,
    },
    computed: {
      ...mapState({
        salaryTableData: state => state.salaryOperation.tableData, // 工资信息数据
        salaryPaginationProps: state => state.salaryOperation.paginationProps, // 工资信息table分页
      }),
    },
    data() {
      return {
        formLayout,
        staffName: '', // 搜索的职员名称
        spinning: false,
        staffTableData: [],
        staffPaginationProps: {
          pageSize: 5, // 默认每页显示数量
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['5', '15', '20', '40', '100'], // 每页数量选项
          total: 0,
          current: 1,
        },
        staffColumns: [
          {
            title: '序号',
            width: 70,
            fixed: 'left',
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          }, {
            title: '工号',
            width: 100,
            fixed: 'left',
            dataIndex: 'staffCode',
            key: 'staffCode',
          }, {
            title: '姓名',
            width: 100,
            fixed: 'left',
            dataIndex: 'staffName',
            key: 'staffName',
          }, {
            title: '部门',
            width: 120,
            dataIndex: 'department',
            key: 'department',
          }, {
            title: '人员类别',
            width: 120,
            dataIndex: 'staffClass',
            key: 'staffClass',
          }, {
            title: '职级',
            width: 100,
            dataIndex: 'rank',
            key: 'rank',
          }, {
            title: '学历',
            width: 120,
            dataIndex: 'degree',
            key: 'degree',
          }, {
            title: '专业技术资格名称',
            width: 180,
            dataIndex: 'techQualification',
            key: 'techQualification',
          }, {
            title: '执业注册资格名称',
            width: 180,
            dataIndex: 'proQualification',
            key: 'proQualification',
          }, {
            title: '职务',
            width: 100,
            dataIndex: 'duty',
            key: 'duty',
          }, {
            title: '证件号码',
            width: 200,
            dataIndex: 'idNumber',
            key: 'idNumber',
          }, {
            title: '性别',
            width: 100,
            dataIndex: 'gender',
            key: 'gender',
          }, {
            title: '民族',
            width: 100,
            dataIndex: 'nation',
            key: 'nation',
          }, {
            title: '岗位',
            width: 150,
            dataIndex: 'job',
            key: 'job',
          }, {
            title: '政治面貌',
            width: 100,
            dataIndex: 'politic',
            key: 'politic',
          }, {
            title: '出生日期',
            width: 150,
            dataIndex: 'dob',
            key: 'dob',
          }, {
            title: '年龄',
            width: 80,
            dataIndex: 'age',
            key: 'age',
          }, {
            title: '参加工作日期',
            width: 150,
            dataIndex: 'participation',
            key: 'participation',
          }, {
            title: '进入系统日期',
            width: 150,
            dataIndex: 'createdAt',
            key: 'createdAt',
          }, {
            title: '第一学历学校',
            width: 150,
            dataIndex: 'firstEducation',
            key: 'firstEducation',
          }, {
            title: '第二学历学校',
            width: 150,
            dataIndex: 'secondEducation',
            key: 'secondEducation',
          }, {
            title: '专业',
            width: 150,
            dataIndex: 'major',
            key: 'major',
          }, {
            title: '工资详情',
            fixed: 'right',
            width: 100,
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
          },
          {
            title: '工资导出',
            fixed: 'right',
            width: 120,
            key: 'export',
            scopedSlots: {customRender: 'export'},
          }
        ],
        currentStaffName: '',
        currentStaffId: '',
        salaryVisible: false,
        salaryTableSpinning: false,
        salaryColumns: [
          {
            title: '序号',
            width: 50,
            dataIndex: 'serial',
            key: 'serial',
            scopedSlots: {customRender: 'serial'}
          },
          {
            title: '合同号',
            width: 150,
            key: 'contractId',
            dataIndex: 'contractId',
          },
          {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
          },
          {
            title: '金额(元)',
            width: 100,
            key: 'money',
            dataIndex: 'money',
          },
        ],
        selectedRowKeys: [],
        selectStaffInfo: [],
        popVisible: false,
      }
    },
    mounted() {
      this.updateStaffTableData();
    },
    methods: {
      ...mapActions({
        getStaffListByNameLikeTable: 'staffOperation/getStaffListByNameLikeTable', // 获取职员列表
        getSalaryListByStaffId: 'salaryOperation/getSalaryListByStaffId', // 获取职员工资列表
        exportByStaff: 'salaryOperation/exportByStaff', // 导出职员工资
      }),
      handleQuery() {
        this.staffPaginationProps.current = 1;
        this.updateStaffTableData();
      },
      // 选择每页个数
      handleStaffTableChange(pagination) {
        this.staffPaginationProps.current = pagination.current;
        this.staffPaginationProps.pageSize = pagination.pageSize;
        this.updateStaffTableData();
      },
      // 更新职员列表数据
      updateStaffTableData() {
        this.spinning = true;
        const params = {
          staffName: this.staffName,
          pageNum: this.staffPaginationProps.current,
          pageLimit: this.staffPaginationProps.pageSize
        };
        this.getStaffListByNameLikeTable(params).then((res) => {
          if (res && res.data.meta.success) {
            this.staffPaginationProps.total = res.data.data.totalElements;
            this.staffTableData = res.data.data.content.map((item, index) => {
              return {
                key: index,
                id: item.id,
                createdAt: item.createdAt && moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
                staffCode: item.staffCode,
                staffName: item.staffName,
                staffClass: item.staffClass && item.staffClass.categoryName,
                degree: item.degree,
                department: item.department && item.department.categoryName,
                dob: item.dob && moment(item.dob).format('YYYY-MM-DD HH:mm:ss'),
                duty: item.duty && item.duty.categoryName,
                firstEducation: item.firstEducation,
                gender: item.gender,
                idNumber: item.idNumber,
                job: item.job && item.job.categoryName,
                major: item.major,
                nation: item.nation,
                participation: item.participation && moment(item.participation).format('YYYY-MM-DD HH:mm:ss'),
                proQualification: item.proQualification,
                rank: item.rank && item.rank.categoryName,
                secondEducation: item.secondEducation,
                techQualification: item.techQualification,
                politic: item.politic,
                selectIndex: !!this.selectStaffInfo.find(value => value.id === item.id),
              }
            });
            this.selectedRowKeys = [];
            this.staffTableData.map((item, index) => {
              if (item.selectIndex) {
                this.selectedRowKeys.push(index);
              }
            });
          } else {
            this.$message.error('服务器错误')
          }
          this.spinning = false;
        }).catch((error) => {
          this.spinning = false;
          this.$message.error(error);
        });
      },
      handleSalaryExport(data) {
        let fileName = data.staffName + data.staffCode + '.xlsx';
        this.exportByStaff({
          id: data.id,
        }).then((data) => {
          if (!data.data) {
            return
          }
          if ('msSaveOrOpenBlob' in navigator) { // IE下导出
            window.navigator.msSaveOrOpenBlob(new Blob([data.data]), fileName);//设置导出的文件名
          } else {
            let url = window.URL.createObjectURL(new Blob([data.data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
          }
          this.$message.success("导出成功");
        }).catch((error) => {
          this.$message.error("导出失败");
        });
      },
      openSalary(data) {
        this.currentStaffName = data.staffName;
        this.currentStaffId = data.id;
        this.updateSalaryTableData();
        this.salaryVisible = true;
      },
      // 更新工资列表数据
      updateSalaryTableData() {
        this.salaryTableSpinning = true;
        const params = {
          staffId: this.currentStaffId,
          pageNum: this.staffPaginationProps.current,
          pageLimit: this.staffPaginationProps.pageSize
        };
        this.getSalaryListByStaffId(params).then((data) => {
          this.salaryTableSpinning = false;
        }).catch((error) => {
          this.salaryTableSpinning = false;
          this.$message.error(error);
        });
      },
      handleSalaryTableChange(pagination) {
        this.salaryPaginationProps.current = pagination.current;
        this.salaryPaginationProps.pageSize = pagination.pageSize;
        this.updateSalaryTableData();
      },
      removeStaffInfo(id) {
        this.selectStaffInfo.splice(this.selectStaffInfo.findIndex(item => item.id === id), 1);
      },
      // 处理项目移除
      handleRemoved(rowData) {
        rowData.selectIndex = false;
        this.removeStaffInfo(rowData.id);
        this.popVisible = true;
      },
      // 处理项目选择
      handleSelected(rowData) {
        rowData.selectIndex = true;
        this.selectStaffInfo.push({
          id: rowData.id,
          staffCode: rowData.staffCode,
          staffName: rowData.staffName,
        });
        this.popVisible = true;
      },
      onSelect(record, selected, selectedRows) {
        if (record.selectIndex) {
          this.handleRemoved(record);
        } else {
          this.handleSelected(record);
        }
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      onSelectAll(selected, selectedRows, changeRows) {
        changeRows.map(item => {
          if (item.selectIndex) {
            this.handleRemoved(item);
          } else {
            this.handleSelected(item);
          }
        });
      },
      handleStaffExport() {
        let fileName = '职员信息.xlsx';
      }
    }
  }
</script>