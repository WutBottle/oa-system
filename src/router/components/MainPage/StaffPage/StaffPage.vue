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
            <a-button type="primary" @click="handleQuery(true)">
              查询
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="() => this.queryVisible=true">精确查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-popover title="职员选择列表" placement="bottom" trigger="click" v-model="popVisible">
              <template slot="content">
                <div v-if="!!selectStaffInfo.length" style="width: 180px">
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
            <a-dropdown :trigger="['click']">
              <a-button icon="down" type="primary">
                导出
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="0">
                  <a-button type="primary" @click="handleStaffExport(false)">
                    选择导出
                  </a-button>
                </a-menu-item>
                <a-menu-item key="1">
                  <a-button type="primary" @click="handleStaffExport(true)">
                    全部导出
                  </a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-form-item>
        </a-form>
        <div class="table-wrapper">
          <a-spin :spinning="spinning" tip="Loading...">
            <a-table bordered :columns="staffColumns" :dataSource="staffTableData"
                     :pagination="staffPaginationProps"
                     :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect: onSelect, onSelectAll: onSelectAll, onChange: onSelectChange}"
                     @change="handleStaffTableChange" :scroll="{ x: 3110, y: 500}">
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
    <a-drawer
            title="筛选条件"
            placement="right"
            :closable="false"
            @close="() => this.queryVisible = false"
            :visible="queryVisible"
            width="500"
    >
      <a-form formLayout="horizontal">
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="年龄"
        >
          <a-input-number :min="0" :max="Infinity" v-model="ageLowerBound"
                          @blur="onChange('ageLowerBound','ageUpperBound')"/>
          ~
          <a-input-number :min="0" :max="Infinity" v-model="ageUpperBound"
                          @blur="onChange('ageLowerBound','ageUpperBound')"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="性别"
        >
          <a-select
                  :allowClear="true"
                  v-model="gender"
                  placeholder="请选择性别"
          >
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="政治面貌"
        >
          <a-select
                  :allowClear="true"
                  v-model="politic"
                  placeholder="请选择政治面貌"
          >
            <a-select-option value="中共党员">中共党员</a-select-option>
            <a-select-option value="中共预备党员">中共预备党员</a-select-option>
            <a-select-option value="共青团员">共青团员</a-select-option>
            <a-select-option value="群众">群众</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="民族"
        >
          <a-select
                  :allowClear="true"
                  v-model="nation"
                  placeholder="请选择民族"
          >
            <a-select-option v-for="item in nationList" :value="item" :key="item">{{item}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="岗位"
        >
          <a-select
                  :allowClear="true"
                  v-model="job"
                  placeholder="请选择岗位"
          >
            <template v-for="option in jobList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="部门"
        >
          <a-select
                  :allowClear="true"
                  v-model="department"
                  placeholder="请选择部门"
          >
            <template v-for="option in departmentList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="人员类别"
        >
          <a-select
                  :allowClear="true"
                  v-model="staffClass"
                  placeholder="请选择人员类别"
          >
            <template v-for="option in staffClassList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="职级"
        >
          <a-select
                  :allowClear="true"
                  v-model="rank"
                  placeholder="请选择职级"
          >
            <template v-for="option in rankList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="学历"
        >
          <a-select
                  :allowClear="true"
                  v-model="degree"
                  placeholder="学历"
          >
            <a-select-option value="专科">专科</a-select-option>
            <a-select-option value="本科">本科</a-select-option>
            <a-select-option value="硕士研究生">硕士研究生</a-select-option>
            <a-select-option value="博士研究生">博士研究生</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="职务"
        >
          <a-select
                  :allowClear="true"
                  v-model="duty"
                  placeholder="请选择职级"
          >
            <template v-for="option in dutyList">
              <a-select-option :key="option.categoryId">
                {{option.categoryName}}
              </a-select-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="参加工作日期"
        >
          <a-range-picker style="width: 220px;" v-model="participationDate"/>
        </a-form-item>
        <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="进入系统日期"
        >
          <a-range-picker style="width: 220px;" v-model="workDateSearchDate"/>
        </a-form-item>
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <a-button type="primary" @click="handleQuery(false)">
            查找
          </a-button>
          <a-button style="margin-left: 16px" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import HeaderPage from "../HeaderPage/HeaderPage";
  import moment from 'moment';

  const formLayout = 'inline';
  const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16},
  };
  const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 6},
  };
  export default {
    name: "StaffPage",
    components: {
      HeaderPage,
    },
    computed: {
      ...mapState({
        salaryTableData: state => state.salaryOperation.tableData, // 工资信息数据
        salaryPaginationProps: state => state.salaryOperation.paginationProps, // 工资信息table分页
        departmentList: state => state.categoryOperation.departmentList,
        staffClassList: state => state.categoryOperation.classificationList,
        rankList: state => state.categoryOperation.rankList,
        dutyList: state => state.categoryOperation.dutyList,
        jobList: state => state.categoryOperation.jobList,
      }),
    },
    data() {
      return {
        formLayout,
        formItemLayout,
        formTailLayout,
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
            sorter: (a, b) => (b.staffCode || '').localeCompare(a.staffCode || ''),
          }, {
            title: '姓名',
            width: 100,
            fixed: 'left',
            dataIndex: 'staffName',
            key: 'staffName',
            sorter: (a, b) => (b.staffName || '').localeCompare(a.staffName || ''),
          }, {
            title: '部门',
            width: 120,
            dataIndex: 'department',
            key: 'department',
            sorter: (a, b) => (b.staffName || '').localeCompare(a.staffName || ''),
          }, {
            title: '人员类别',
            width: 120,
            dataIndex: 'staffClass',
            key: 'staffClass',
            sorter: (a, b) => (b.staffClass || '').localeCompare(a.staffClass || ''),
          }, {
            title: '职级',
            width: 100,
            dataIndex: 'rank',
            key: 'rank',
            sorter: (a, b) => (b.rank || '').localeCompare(a.rank || ''),
          }, {
            title: '学历',
            width: 120,
            dataIndex: 'degree',
            key: 'degree',
            sorter: (a, b) => (b.degree || '').localeCompare(a.degree || ''),
          }, {
            title: '专业技术资格名称',
            width: 180,
            dataIndex: 'techQualification',
            key: 'techQualification',
            sorter: (a, b) => (b.techQualification || '').localeCompare(a.techQualification || ''),
          }, {
            title: '执业注册资格名称',
            width: 180,
            dataIndex: 'proQualification',
            key: 'proQualification',
            sorter: (a, b) => (b.proQualification || '').localeCompare(a.proQualification || ''),
          }, {
            title: '职务',
            width: 100,
            dataIndex: 'duty',
            key: 'duty',
            sorter: (a, b) => (b.duty || '').localeCompare(a.duty || ''),
          }, {
            title: '证件号码',
            width: 200,
            dataIndex: 'idNumber',
            key: 'idNumber',
            sorter: (a, b) => (b.idNumber || '').localeCompare(a.idNumber || ''),
          }, {
            title: '性别',
            width: 100,
            dataIndex: 'gender',
            key: 'gender',
            sorter: (a, b) => (b.gender || '').localeCompare(a.gender || ''),
          }, {
            title: '民族',
            width: 100,
            dataIndex: 'nation',
            key: 'nation',
            sorter: (a, b) => (b.nation || '').localeCompare(a.nation || ''),
          }, {
            title: '岗位',
            width: 150,
            dataIndex: 'job',
            key: 'job',
            sorter: (a, b) => (b.job || '').localeCompare(a.job || ''),
          }, {
            title: '政治面貌',
            width: 120,
            dataIndex: 'politic',
            key: 'politic',
            sorter: (a, b) => (b.politic || '').localeCompare(a.politic || ''),
          }, {
            title: '出生日期',
            width: 150,
            dataIndex: 'dob',
            key: 'dob',
            sorter: (a, b) => new Date(a.dob) - new Date(b.dob),
          }, {
            title: '年龄',
            width: 100,
            dataIndex: 'age',
            key: 'age',
            sorter: (a, b) => a.age - b.age,
          }, {
            title: '参加工作日期',
            width: 150,
            dataIndex: 'participation',
            key: 'participation',
            sorter: (a, b) => new Date(a.participation) - new Date(b.participation),
          }, {
            title: '进入系统日期',
            width: 150,
            dataIndex: 'workDate',
            key: 'workDate',
            sorter: (a, b) => new Date(a.workDate) - new Date(b.workDate),
          }, {
            title: '第一学历学校',
            width: 150,
            dataIndex: 'firstEducation',
            key: 'firstEducation',
            sorter: (a, b) => (b.firstEducation || '').localeCompare(a.firstEducation || ''),
          }, {
            title: '第二学历学校',
            width: 150,
            dataIndex: 'secondEducation',
            key: 'secondEducation',
            sorter: (a, b) => (b.secondEducation || '').localeCompare(a.secondEducation || ''),
          }, {
            title: '专业',
            width: 150,
            dataIndex: 'major',
            key: 'major',
            sorter: (a, b) => (b.major || '').localeCompare(a.major || ''),
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
            sorter: (a, b) => (b.contractId || '').localeCompare(a.contractId || ''),
          },
          {
            title: '合同名称',
            width: 200,
            key: 'contractName',
            dataIndex: 'contractName',
            sorter: (a, b) => (b.contractName || '').localeCompare(a.contractName || ''),
          },
          {
            title: '金额(元)',
            width: 100,
            key: 'money',
            dataIndex: 'money',
            sorter: (a, b) => a.money - b.money,
          },
        ],
        selectedRowKeys: [],
        selectStaffInfo: [],
        popVisible: false,
        nationList: [
          "汉族",
          "壮族",
          "满族",
          "回族",
          "苗族",
          "维吾尔族",
          "土家族",
          "彝族",
          "蒙古族",
          "藏族",
          "布依族",
          "侗族",
          "瑶族",
          "朝鲜族",
          "白族",
          "哈尼族",
          "哈萨克族",
          "黎族",
          "傣族",
          "畲族",
          "傈僳族",
          "仡佬族",
          "东乡族",
          "高山族",
          "拉祜族",
          "水族",
          "佤族",
          "纳西族",
          "羌族",
          "土族",
          "仫佬族",
          "锡伯族",
          "柯尔克孜族",
          "达斡尔族",
          "景颇族",
          "毛南族",
          "撒拉族",
          "布朗族",
          "塔吉克族",
          "阿昌族",
          "普米族",
          "鄂温克族",
          "怒族",
          "京族",
          "基诺族",
          "德昂族",
          "保安族",
          "俄罗斯族",
          "裕固族",
          "乌孜别克族",
          "门巴族",
          "鄂伦春族",
          "独龙族",
          "塔塔尔族",
          "赫哲族",
          "珞巴族",
          "其他"
        ],
        queryVisible: false,
        ageLowerBound: null,
        ageUpperBound: null,
        gender: undefined,
        politic: undefined,
        nation: undefined,
        job: undefined,
        department: undefined,
        staffClass: undefined,
        rank: undefined,
        degree: undefined,
        duty: undefined,
        participationDate: [],
        workDateSearchDate: [],
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
        staffExport: 'staffOperation/staffExport',
      }),
      handleQuery(isReset) {
        if (isReset) {
          this.handleReset();
        }
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
        let participation, workDate;
        if (this.participationDate.length) {
          participation = [moment(this.participationDate[0]).format('YYYY-MM-DD'), moment(this.participationDate[1]).format('YYYY-MM-DD')]
        } else {
          participation = ['', '']
        }
        if (this.workDateSearchDate.length) {
          workDate = [moment(this.workDateSearchDate[0]).format('YYYY-MM-DD'), moment(this.workDateSearchDate[1]).format('YYYY-MM-DD')]
        } else {
          workDate = ['', '']
        }
        const params = {
          staffName: this.staffName,
          participation: participation,
          workDate: workDate,
          age: [this.ageLowerBound ? String(this.ageLowerBound) : '', this.ageUpperBound ? String(this.ageUpperBound) : ''],
          gender: this.gender,
          politic: this.politic,
          nation: this.nation,
          jobId: this.job,
          departmentId: this.department,
          staffClassId: this.staffClass,
          rankId: this.rank,
          degree: this.degree,
          dutyId: this.duty,
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
                workDate: item.workDate && moment(item.workDate).format('YYYY-MM-DD'),
                staffCode: item.staffCode,
                staffName: item.staffName,
                staffClass: item.staffClass && item.staffClass.categoryName,
                degree: item.degree,
                department: item.department && item.department.categoryName,
                dob: item.dob && moment(item.dob).format('YYYY-MM-DD'),
                age: item.dob && moment().diff(item.dob, 'years'),
                duty: item.duty && item.duty.categoryName,
                firstEducation: item.firstEducation,
                gender: item.gender,
                idNumber: item.idNumber,
                job: item.job && item.job.categoryName,
                major: item.major,
                nation: item.nation,
                participation: item.participation && moment(item.participation).format('YYYY-MM-DD'),
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
      handleStaffExport(type) {
        let fileName = '职员信息.xlsx';
        if (this.selectStaffInfo.length) {
          this.staffExport({
            staffIds: this.selectStaffInfo.map((item) => {return item.id.toString()}),
            all: type,
          }).then((data) => {
            if (!data.data) {
              return
            }
            if ('msSaveOrOpenBlob' in navigator){ // IE下导出
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
        } else {
          this.$message.warning('您的选择列表为空！');
        }
      },
      onChange(lowerBound, upperBound) {
        if (this[lowerBound] && this[upperBound] && this[upperBound] < this[lowerBound]) {
          let temp = this[lowerBound];
          this[lowerBound] = this[upperBound];
          this[upperBound] = temp;
        }
      },
      handleReset() {
        Object.assign(this, {
          ageLowerBound: null,
          ageUpperBound: null,
          gender: undefined,
          politic: undefined,
          nation: undefined,
          job: undefined,
          department: undefined,
          staffClass: undefined,
          rank: undefined,
          degree: undefined,
          duty: undefined,
          participationDate: [],
          createdAtDate: [],
        })
      },
    }
  }
</script>