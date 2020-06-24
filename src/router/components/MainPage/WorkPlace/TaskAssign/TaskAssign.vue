<style scoped lang="scss">
  .TaskAssign {
    .demo-infinite-container {
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      overflow: auto;
      padding: 8px 24px;
      height: 500px;

      .card-style {
        width: 100%;
        display: inline-block;
        margin-bottom: 12px;

        img {
          margin: 0 auto;
          width: auto;
          height: 160px;
        }

        img:hover {
          cursor: pointer;
        }

        .title-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          word-break: break-all;
          white-space: normal;

          .title {
            flex: 1;
          }

          .status-wrapper {
            width: 160px;
          }
        }

        .description-wrapper {
          .ddl {
            text-align: right;
          }
        }

        .pdf-wrapper {
          margin-top: 6px;
          text-align: right;
        }
      }
    }
  }
</style>

<template>
  <div class="TaskAssign">
    <a-card>
      <a-badge slot="title" status="warning" :text="'任务分配' + (isMine ? '（我创建）' : '（被分配）')"/>
      <template slot="extra">
        <a-popover v-model="optionVisible" title="筛选条件" trigger="click">
          <a-radio-group slot="content" v-model="isMine" button-style="solid" @change="handleTypeChange">
            <a-radio-button :value="false">
              被分配的
            </a-radio-button>
            <a-radio-button :value="true">
              我创建的
            </a-radio-button>
          </a-radio-group>
          <a>筛选</a>
        </a-popover>
        <a-divider type="vertical"/>
        <a @click="() => this.addVisible = true">添加</a>
      </template>
      <div class="demo-infinite-container"
           v-infinite-scroll="handleOnLoad"
           :infinite-scroll-disabled="undoneBusy"
           :infinite-scroll-distance="10"
      >
        <div v-if="taskListData.length">
          <template v-for="(item, index) in new Array(Math.ceil(taskListData.length/4))">
            <a-row :gutter="8" :key="index">
              <a-col :span="6" v-for="item in taskListData.slice(index*4, index*4 + 4)" :key="item.id">
                <a-card class="card-style">
                  <img
                          slot="cover"
                          alt="image"
                          :src="item.image || 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2528034250,2637172852&fm=11&gp=0.jpg'"
                          @click="() => window.open(item.image || 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2528034250,2637172852&fm=11&gp=0.jpg', '_blank')"
                  />
                  <template slot="actions" class="ant-card-actions">
                    <a-tooltip>
                      <template slot="title">
                        分享
                      </template>
                      <a-icon key="share-alt" type="share-alt" @click="showShareModal(item.id)"/>
                    </a-tooltip>
                    <a-tooltip v-if="isMine">
                      <template slot="title">
                        编辑
                      </template>
                      <a-icon key="edit" type="edit" @click="handleEdit(item)"/>
                    </a-tooltip>
                    <a-tooltip>
                      <template slot="title">
                        反馈意见
                      </template>
                      <a-icon key="message" type="message" @click="handleComment(item)"/>
                    </a-tooltip>
                    <a-tooltip>
                      <template slot="title">
                        完成
                      </template>
                      <a-popconfirm title="是否完成任务？" ok-text="确定" cancel-text="取消" @confirm="handleDone(item.id)">
                        <a-icon key="check-circle" type="check-circle"/>
                      </a-popconfirm>
                    </a-tooltip>
                    <a-tooltip v-if="isMine">
                      <template slot="title">
                        删除
                      </template>
                      <a-popconfirm title="确定要删除该任务？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(item.id)">
                        <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                        <a-icon key="delete" type="delete"/>
                      </a-popconfirm>
                    </a-tooltip>
                  </template>
                  <a-card-meta>
                    <template slot="title">
                      <div class="title-wrapper">
                        <a-tooltip v-if="item.title.length > 15">
                          <template slot="title">
                            {{item.title}}
                          </template>
                          <span class="title">{{item.title.substring(0, 15) + '...'}}</span>
                        </a-tooltip>
                        <span class="title" v-else>
                          {{item.title}}
                        </span>
                        <div class="status-wrapper">
                          <a-divider type="vertical"/>
                          <a-popover title="执行人员">
                            <template slot="content">
                              <a-tag color="green">{{item.founder.nickname}}</a-tag>
                              <a-tag color="blue" v-for="user in item.assignees" :key="user.userId">{{user.nickname}}
                              </a-tag>
                            </template>
                            <a>执行人员</a>
                          </a-popover>
                          <a-divider type="vertical"/>
                          <a-tag color="green" v-if="item.status">已完成</a-tag>
                          <a-tag color="red" v-else>未完成</a-tag>
                        </div>
                      </div>
                    </template>
                    <template slot="description">
                      <div class="description-wrapper">
                        <a-tooltip v-if="item.content.length > 100">
                          <template slot="title">
                            {{item.content}}
                          </template>
                          {{item.content.substring(0, 100) + '...'}}
                        </a-tooltip>
                        <span v-else>
                          {{item.content}}
                        </span>
                        <div class="ddl">截止时间:{{item.targetDate}}</div>
                      </div>
                    </template>
                  </a-card-meta>
                  <div class="pdf-wrapper" v-if="item.pdfFile">
                    <a @click="() => window.open(item.pdfFile, '_blank')">
                      任务文件:{{item.pdfFile.substring(item.pdfFile.length - 10, item.pdfFile.length - 4) + '.' + item.pdfFile.split('.').reverse()[0]}}</a>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </template>
        </div>
        <a-empty v-else style="margin-top: 60px"/>
      </div>

    </a-card>
    <a-modal
            title="新增任务"
            v-model="addVisible"
            @ok="submitForm"
            okText="提交"
            cancelText="取消"
            :afterClose="handleAddClose"
            :maskClosable="false"
    >
      <a-form
              :form="addForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="标题"
        >
          <a-input
                  v-decorator="[
          'title',
          {rules: [{required: true, message: '请输入标题!'}]}
        ]"
                  placeholder="请输入标题"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="任务详情"
        >
          <a-textarea
                  v-decorator="[
          'content',
          {rules: [{required: true, message: '请输入任务详情!'}]}
        ]"
                  :auto-size="{minRows: 2, maxRows: 4}"
                  placeholder="请输入任务详情"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="执行人员"
        >
          <a-select
                  v-decorator="['assignees',
                  {rules: [{required: true, message: '请分配人员!'}]}
                  ]"
                  showSearch
                  placeholder="搜索用户"
                  :showArrow="false"
                  :filterOption="false"
                  @search="fetchUsers"
                  notFoundContent="无搜索结果"
                  :defaultActiveFirstOption="false"
                  :allowClear="true"
                  @blur="clearUserData"
                  mode="multiple"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="(d,index) in usersData" :key="d.userId">{{d.username}}
              <a-divider type="vertical"/>
              <a-tag color="orange">{{d.nickname}}</a-tag>
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="截止时间"
        >
          <a-date-picker
                  v-decorator="['targetDate',
                  {rules: [{required: true, message: '请选择截止时间!'}]}]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="PDF"
        >
          <a-upload
                  :fileList="fileList"
                  :beforeUpload="file => beforeUpload(file, 'fileList')"
                  :remove="file => handleRemove(file, 'fileList')"
                  :multiple="false"
          >
            <a-button :loading="uploadSpinning">
              <a-icon type="upload"/>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="图片"
        >
          <a-upload
                  :fileList="imageList"
                  :beforeUpload="file => beforeUpload(file, 'imageList')"
                  :remove="file => handleRemove(file, 'imageList')"
                  :multiple="false"
                  list-type="picture-card"
                  @preview="handlePreview"
          >
            <div v-if="imageList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
    <a-modal v-model="shareVisible" title="选择共享人员"
             @ok="handleShare"
             :maskClosable="false"
             :afterClose="() => this.sharedUser = undefined"
    >
      <a-select
              v-model="sharedUser"
              showSearch
              style="width: 100%;"
              placeholder="搜索用户"
              :showArrow="false"
              :filterOption="false"
              @search="fetchUsers"
              notFoundContent="无搜索结果"
              :defaultActiveFirstOption="false"
              :allowClear="true"
              @blur="clearUserData"
      >
        <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
        <a-select-option v-for="(d,index) in usersData" :key="d.userId">{{d.username}}
          <a-divider type="vertical"/>
          <a-tag color="orange">{{d.nickname}}</a-tag>
        </a-select-option>
      </a-select>
    </a-modal>
    <a-drawer
            title="修改任务信息"
            placement="right"
            :closable="false"
            width="500"
            @close="onEditClose"
            :visible="editVisible"
    >
      <a-form
              :form="editForm"
      >
        <a-form-item
                v-bind="formItemLayout"
                label="标题"
        >
          <a-input
                  v-decorator="[
          'title',
          {
            initialValue: this.editTaskData.title,
            rules: [{required: true, message: '请输入标题!'}]}
        ]"
                  placeholder="请输入标题"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="任务详情"
        >
          <a-textarea
                  v-decorator="[
          'content',
          {
            initialValue: this.editTaskData.content,
            rules: [{required: true, message: '请输入任务详情!'}]}
        ]"
                  :auto-size="{minRows: 2, maxRows: 6}"
                  placeholder="请输入任务详情"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="执行人员"
        >
          <a-select
                  v-decorator="[
            'assignees',
            {
              initialValue: this.editTaskData.initialAssignees,
              rules: [{required: true, message: '请分配人员!'}]}
            ]"
            showSearch
            placeholder="搜索用户"
            :showArrow="false"
            :filterOption="false"
            @search="fetchUsers"
            notFoundContent="无搜索结果"
            :defaultActiveFirstOption="false"
            :allowClear="true"
            @blur="() => this.initialUser = []"
            mode="multiple"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option v-for="(d,index) in initialUser" :key="d.userId">{{d.username}}
              <a-divider type="vertical"/>
              <a-tag color="orange">{{d.nickname}}</a-tag>
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="截止时间"
        >
          <a-date-picker
                  v-decorator="['targetDate',
                  {
                    initialValue: this.editTaskData.targetDate,
                    rules: [{required: true, message: '请选择截止时间!'}]}]"
                  show-time
                  format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="PDF"
        >
          <a-upload
                  :fileList="fileList"
                  :beforeUpload="file => beforeUpload(file, 'fileList')"
                  :remove="file => handleRemove(file, 'fileList')"
                  :multiple="false"
          >
            <a-button :loading="uploadSpinning">
              <a-icon type="upload"/>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
                v-bind="formItemLayout"
                label="图片"
        >
          <a-upload
                  :fileList="imageList"
                  :beforeUpload="file => beforeUpload(file, 'imageList')"
                  :remove="file => handleRemove(file, 'imageList')"
                  :multiple="false"
                  list-type="picture-card"
                  @preview="handlePreview"
          >
            <div v-if="imageList.length < 1">
              <a-icon type="plus"/>
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item
                :label-col="formTailLayout.labelCol"
                :wrapper-col="formTailLayout.wrapperCol"
        >
          <a-button
                  type="primary"
                  @click="submitEditForm"
          >
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
    <a-drawer
            title="任务反馈信息"
            placement="right"
            :closable="false"
            width="500"
            @close="() => this.commentVisible = false"
            :visible="commentVisible"
    >
      <a-list
              class="comment-list"
              :header="`${commentListData.length} 条反馈意见`"
              item-layout="horizontal"
              :data-source="commentListData"
      >
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-comment :author="item.author" :avatar="item.avatar">
            <template slot="actions">
              <a-popconfirm title="确定删除？" @confirm="handleCommentDelete(item.feedBackId)">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a>{{item.actions}}</a>
              </a-popconfirm>
            </template>
            <p slot="content">
              {{ item.content }}
            </p>
            <a v-if="item.fileName" target="_blank" :href="item.fileName">
              <a-tag color="green">
                附件：{{item.fileName.substring(item.fileName.length - 12, item.fileName.length)}}
              </a-tag>
            </a>
            <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ item.datetime.fromNow() }}</span>
            </a-tooltip>
          </a-comment>
        </a-list-item>
      </a-list>
      <a-comment>
        <a-avatar
                slot="avatar"
                :src="avatarSetting[role]"
                alt="Han Solo"
        />
        <div slot="content">
          <a-form-item>
            <a-textarea :rows="4" :maxLength="250" :value="commentValue" @change="handleCommentChange" />
          </a-form-item>
          <a-form-item>
            <a-upload
                    :fileList="commentFileList"
                    :beforeUpload="beforeCommentUpload"
                    :remove="file => handleRemove(file, 'commentFileList')"
                    :multiple="false"
            >
              <a-button><a-icon type="upload" />上传附件</a-button>
            </a-upload>
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit" :loading="submitting" type="primary" @click="handleCommentSubmit">
              添加反馈
            </a-button>
          </a-form-item>
        </div>
      </a-comment>
    </a-drawer>

  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex";
  import api from '@/api/apiSugar';
  import baseUrl from '@api/baseUrl';
  import moment from "moment"; // 导入接口域名列表

  const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 12},
  };
  const formTailLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 14, offset: 8},
  };
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  export default {
    name: "TaskAssign",
    computed: {
      ...mapState({
        role: state => state.tokensOperation.role, // 工资信息数据
      }),
    },
    data() {
      return {
        formItemLayout,
        formTailLayout,
        testData: [
          {
            actions: ['删除'],
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            datetime: moment().subtract(1, 'days'),
          },{
            actions: ['删除'],
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content:
              'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            datetime: moment().subtract(1, 'days'),
          }
        ],
        moment,
        undoneBusy: false,
        window: window,
        optionVisible: false,
        isMine: false,
        addVisible: false,
        addForm: this.$form.createForm(this),
        editForm: this.$form.createForm(this),
        previewVisible: false,
        usersData: [], // 用户列表
        fetching: false,
        fileList: [],
        pdfFile: '',
        imageList: [],
        imageFile: '',
        previewImage: '',
        uploadSpinning: false,
        paginationProps: {
          pageNum: 1,
          pageLimit: 8,
          total: 8,
        },
        taskListData: [],
        shareVisible: false,
        currentTaskId: '',
        sharedUser: undefined,
        editVisible: false,
        editTaskData: {},
        initialUser: [],
        commentVisible: false,
        submitting: false,
        commentValue: '',
        avatarSetting: {
          部门负责人: require('@/assets/总监.png'),
          超级管理员: require('@/assets/超级管理员.png'),
          普通用户: require('@/assets/普通用户.png'),
        },
        commentFileList: [],
        commentFile: '',
        currentTaskData: {},
        commentListData: [],
      }
    },
    methods: {
      ...mapActions({
        receiptUpload: 'receiptOperation/receiptUpload',
        getUserListByNameLike: 'userOperation/getUserListByNameLike', // 用户的模糊查询
      }),
      getAssignmentList(reset) {
        if (reset) {
          Object.assign(this, {
            paginationProps: {
              pageNum: 1,
              pageLimit: 8,
              total: 8,
            },
            taskListData: [],
          });
        }
        const data = this.taskListData;
        if (data.length === this.paginationProps.total) {
          this.$message.warning('已加载到底部');
          return;
        }
        api.assignmentController.getAssignmentList({
          pageNum: this.paginationProps.pageNum,
          pageLimit: this.paginationProps.pageLimit,
          isMine: this.isMine,
        }).then(res => {
          if (res.data.data.totalPages > this.paginationProps.pageNum) {
            this.paginationProps.pageNum++;
          }
          this.taskListData = data.concat(res.data.data.content.map(item => {
            return {
              id: item.id,
              targetDate: moment(item.targetDate).format('YYYY-MM-DD'),
              content: item.content,
              pdfFile: item.pdfFile,
              image: item.image,
              assignees: item.assignees,
              founder: item.founder,
              status: item.status,
              title: item.title,
            };
          }));
          this.paginationProps.total = res.data.data.totalElements;
        })
      },
      handleOnLoad() {
        this.getAssignmentList(false);
      },
      handleAddReset() {
        this.addForm.resetFields();
        Object.assign(this, {
          fileList: [],
          pdfFile: '',
          imageList: [],
          imageFile: '',
          previewImage: '',
        });
      },
      submitForm() {
        this.addForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                title: values.title,
                content: values.content,
                assignees: values.assignees.map(item => {
                  return {userId: item}
                }),
                targetDate: values.targetDate,
                pdfFile: this.pdfFile,
                image: this.imageFile,
              };
              api.assignmentController.addAssignment(params).then(res => {
                if (res.data.meta.success) {
                  this.$message.success('添加成功');
                  this.addVisible = false;
                  this.handleAddReset();
                  this.getAssignmentList(true);
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch(error => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      handleAddClose() {
        this.handleAddReset();
      },
      handlePreviewCancel() {
        this.previewVisible = false;
      },
      async handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
      },
      fetchUsers(value) {
        const params = {
          username: value,
          pageNum: 1,
          pageLimit: 10,
        };
        this.fetching = true;
        this.getUserListByNameLike(params).then((res) => {
          this.usersData = res.data.data.content;
          this.initialUser = res.data.data.content;
          this.fetching = false;
        });
      },
      clearUserData() {
        this.usersData = [];
      },
      handleRemove(file, name) {
        const index = this[name].indexOf(file);
        const newFileList = this[name].slice();
        newFileList.splice(index, 1);
        this[name] = newFileList;
        switch (name) {
          case 'imageList': this.imageFile = '';break;
          case 'fileList' : this.pdfFile = '';break;
          case 'commentFileList' : this.commentFile = '';break;
        }
      },
      beforeUpload(file, name) {
        this.uploadSpinning = true;
        this.handleRemove(file, name);
        let preName = '';
        if (file.type === 'application/pdf' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
          preName = file.name;
          const formData = new FormData();
          this[name] = [...this[name], file];
          this[name].forEach((file) => {
            formData.append('multipartFiles', file);
          });
          // 手动上传
          api.assignmentController.upload(formData).then((data) => {
            this.handleRemove(file, name);
            if (name === 'fileList') {
              this.pdfFile = baseUrl.serverBaseController + data.data.data;
            } else {
              this.imageFile = baseUrl.serverBaseController + data.data.data;
            }
            this[name].push({
              uid: '-1',
              name: preName,
              status: 'done',
              url: name === 'fileList' ? this.pdfFile : this.imageFile,
            });
            this.$message.success('文件已上传');
            this.uploadSpinning = false;
          }).catch((error) => {
            this.$message.error('上传失败');
            this.uploadSpinning = false;
          });
        } else {
          this.$message.error(name === 'fileList' ? '只能上传.pdf文件类型' : '只能上传.png|.jpg|.jpeg文件类型');
          this.handleRemove(file, name);
          this.uploadSpinning = false;
        }
        return false;
      },
      beforeCommentUpload(file) {
        this.submitting = true;
        this.handleRemove(file, 'commentFileList');
        let preName = '';
        preName = file.name;
        const formData = new FormData();
        this.commentFileList = [...this.commentFileList, file];
        this.commentFileList.forEach((file) => {
          formData.append('multipartFiles', file);
        });
        // 手动上传
        api.feedBackController.upload(formData).then((data) => {
          this.handleRemove(file, 'commentFileList');
          this.commentFile = baseUrl.serverBaseController + data.data.data;
          this.commentFileList.push({
            uid: '-1',
            name: preName,
            status: 'done',
            url: this.commentFile,
          });
          this.$message.success('文件已上传');
          this.submitting = false;
        }).catch((error) => {
          this.$message.error('上传失败');
          this.submitting = false;
        });
        return false;
      },
      handleTypeChange(e) {
        this.isMine = e.target.value;
        this.getAssignmentList(true);
      },
      handleDelete(id) {
        api.assignmentController.deleteAssignment({
          assignmentId: id
        }).then(res => {
          if (res.data.meta.success) {
            this.$message.success(res.data.data);
            this.getAssignmentList(true);
          } else {
            this.$message.error(res.data.meta.message);
          }
        })
      },
      handleDone(id) {
        api.assignmentController.finish({
          assignmentId: id
        }).then(res => {
          if (res.data.meta.success) {
            this.$message.success(res.data.data);
            this.getAssignmentList(true);
          } else {
            this.$message.error(res.data.meta.message);
          }
        })
      },
      showShareModal(id) {
        this.currentTaskId = id;
        this.shareVisible = true;
      },
      handleShare() {
        if (this.sharedUser) {
          api.assignmentController.shareAssignment({
            beSharedId: this.sharedUser,
            assignmentId: this.currentTaskId,
          }).then(res => {
            if (res.data.meta.success) {
              this.$message.success(res.data.data);
              this.shareVisible = false;
              this.getAssignmentList(true);
            } else {
              this.$message.error(res.data.meta.message);
            }
          })
        } else {
          this.$message.warning('您还未选择人员');
        }
      },
      handleEdit(data) {
        const {id, title, targetDate, content, image, pdfFile = '', assignees = '', founder} = data;
        const initialAssignees = assignees.map(item => item.userId);
        this.initialUser = assignees.map(item => {
          return {
            userId: item.userId,
            username: item.username,
            nickname: item.nickname,
          }
        });
        this.fileList = [];
        pdfFile && this.fileList.push({
          uid: '-1',
          name: pdfFile.substring(pdfFile.length - 10, pdfFile.length - 4) + '.' + pdfFile.split('.').reverse()[0],
          status: 'done',
          url: pdfFile,
        });
        image && this.imageList.push({
          uid: '-1',
          name: image.substring(image.length - 10, image.length - 4) + '.' + image.split('.').reverse()[0],
          status: 'done',
          url: image,
        });
        this.pdfFile = pdfFile;
        this.imageFile = image;
        Object.assign(this.editTaskData, {
          id,
          title,
          targetDate: moment(targetDate),
          content,
          image,
          pdfFile,
          initialAssignees,
          founder,
        });
        this.editVisible = true;
      },
      onEditClose() {
        this.editVisible = false;
        Object.assign(this, {
          initialUser: [],
          fileList: [],
          imageList: [],
          pdfFile: '',
          imageFile: '',
        });
        this.editForm.resetFields();
      },
      submitEditForm() {
        this.editForm.validateFields(
          (err, values) => {
            if (!err) {
              const params = {
                id: this.editTaskData.id,
                title: values.title,
                content: values.content,
                assignees: values.assignees.map(item => {
                  return {userId: item}
                }),
                founder: this.editTaskData.founder,
                targetDate: values.targetDate,
                pdfFile: this.pdfFile,
                image: this.imageFile,
              };
              api.assignmentController.verifyAssignment(params).then(res => {
                if (res.data.meta.success) {
                  this.$message.success('修改成功');
                  this.addVisible = false;
                  this.onEditClose();
                  this.getAssignmentList(true);
                } else {
                  this.$message.error(res.data.meta.message);
                }
              }).catch(error => {
                this.$message.error(error);
              })
            }
          },
        );
      },
      getFeedBackList() {
        api.feedBackController.getFeedBackList({
          assignmentId: this.currentTaskId
        }).then(res => {
          if(res && res.data) {
            this.commentListData = res.data.data.map(item => {
              return {
                actions: '删除',
                content: item.content,
                feedBackId: item.feedBackId,
                author: item.user.nickname,
                avatar: this.avatarSetting[item.user.roles[0].name],
                fileName: item.fileName,
                datetime: moment(item.createDate),
              }
            });
            this.commentVisible = true;
          }else {
            this.$message.error('网络错误！');
          }
        });
      },
      handleComment(item) {
        this.currentTaskId = item.id;
        this.getFeedBackList();
      },
      handleCommentSubmit() {
        if (this.commentFile || this.commentValue) {
          this.submitting = true;
          api.feedBackController.addFeedBack({
            assignmentId: this.currentTaskId,
            content: this.commentValue,
            fileName: this.commentFile,
          }).then(res => {
            if (res.data && res.data.meta.success) {
              this.$message.success(res.data.data);
              Object.assign(this, {
                commentFile: '',
                commentValue: '',
                commentFileList: [],
              });
              this.getFeedBackList();
            }else {
              this.$message.error('网络错误！');
            }
            this.submitting = false;
          })
        }else {
          this.$message.error('请输入反馈意见')
        }
      },
      handleCommentChange(e) {
        this.commentValue = e.target.value;
      },
      handleCommentDelete(id) {
        api.feedBackController.deleteFeedBack({
          feedBackId: id
        }).then(res => {
          if (res.data && res.data.meta.success) {
            this.$message.success(res.data.data);
            this.getFeedBackList();
          }else {
            this.$message.error('网络错误！');
          }
        })
      }
    }
  }
</script>

