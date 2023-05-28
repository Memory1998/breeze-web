<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchFileForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="原始名称" prop="originalFileName">
              <el-input v-model="searchFileForm.originalFileName" clearable placeholder="原始文件名称"/>
            </el-form-item>
            <el-form-item label="新名称" prop="newFileName">
              <el-input v-model="searchFileForm.newFileName" clearable placeholder="新文件名称"/>
            </el-form-item>
            <el-form-item label="创建人" prop="createName">
              <el-input v-model="searchFileForm.createName" clearable placeholder="创建人"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:file:upload']" plain size="mini" type="primary" @click="create">新建</el-button>
        <el-button v-has="['sys:file:delete']" :disabled="checkDeleteItem" plain size="mini" type="danger"
                   @click="remove">删除
        </el-button>
      </div>
      <el-table
        ref="fileTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="fileTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="fileHandleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200">
        </el-table-column>
        <el-table-column
          label="标题"
          prop="title"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="原始名称"
          prop="originalFileName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="新名称"
          prop="newFileName"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'OSS_STYLE')"
          label="存储方式"
          prop="ossStyle"
          show-overflow-tooltip/>
        <el-table-column
          label="存储路径"
          prop="path"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建人ID"
          prop="createBy"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button v-has="['sys:file:preview']" size="mini" type="text" @click="preview(scope.row)">预览</el-button>
            <el-button v-has="['sys:file:download']" size="mini" type="text" @click="download(scope.row)">下载
            </el-button>
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:file:modify']" size="mini" type="text" @click="edit(scope.row)">更新</el-button>
            <el-button v-has="['sys:file:delete']" size="mini" type="text"
                       @click.native.prevent="removeItem(scope.$index, fileTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchFileForm.current"
          :page-size="searchFileForm.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="previewDialogVisible" width="500px"
               @close="closeUploadDialog">
      <el-main>
        <el-image
          :preview-src-list="[imgUrl]"
          :src="imgUrl"
          style="width: 400px;">
        </el-image>
      </el-main>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="uploadDialogVisible" width="400px"
               @close="closeUploadDialog">
      <el-form ref="uploadFileFrom" :model="file" :rules="fileRules" label-width="0" size="mini">
        <el-form-item prop="title">
          <el-input v-model="file.title" placeholder="请输入文件标题"/>
        </el-form-item>
        <el-form-item prop="ossStyle" style="margin-bottom: 20px;">
          <el-select v-model="file.ossStyle" :disabled="true" placeholder="请选择存储位置">
            <el-option
              v-for="item in this.dict()('OSS_STYLE')"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-upload
          :http-request="uploadImage"
          :show-file-list="false"
          action=""
          class="upload-demo"
          drag
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="950px"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="标题">
          {{ file.title }}
        </el-descriptions-item>
        <el-descriptions-item label="原始名称">
          {{ file.originalFileName }}
        </el-descriptions-item>
        <el-descriptions-item label="新名称">
          <el-tag size="small">
            {{ file.newFileName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="存储方式">
          <el-tag size="small">
            {{ this.descriptions()(file, 'ossStyle', 'OSS_STYLE') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="存储路径">
          {{ file.path }}
        </el-descriptions-item>
        <el-descriptions-item label="创建人">
          {{ file.createName }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { del, download, list, preview, uploadMinioS3 } from '@/api/system/file'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { saveAs } from 'file-saver'
import { dict } from '@/mixins'

export default {
  name: 'File',
  mixins: [dict],
  data () {
    return {
      // 此页面需要字典编码
      dictCode: ['OSS_STYLE'],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionFileIds: [],
      // 文件表格数据
      fileTableData: [],
      // 表格展示图片地址
      imgUrl: '',
      // 文件查询条件数据
      searchFileForm: {
        originalFileName: '',
        newFileName: '',
        createBy: '',
        createName: '',
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDeleteItem: true,
      // 文件上传弹出框
      uploadDialogVisible: false,
      // 图片预览弹出框
      previewDialogVisible: false,
      // 文件详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 文件添加修改数据
      file: {
        id: null,
        title: '',
        ossStyle: '1'
      },
      // 文件详情数据
      fileInfo: {
        id: null,
        title: '',
        ossStyle: ''
      },
      // 文件添加修改表单规则
      fileRules: {
        title: [
          {
            required: true,
            message: '请输入文件标题',
            trigger: 'blur'
          }
        ],
        ossStyle: [
          {
            required: true,
            message: '请选择存储位置',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created () {
    this.reloadList()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        if (response.code === 1) {
          this.fileTableData = response.data.records
          this.searchFileForm.size = response.data.size
          this.searchFileForm.current = response.data.current
          this.total = response.data.total
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{originalFileName: string, createBy: string, size: number, newFileName: string, createName: string}}
     */
    buildParam () {
      return this.searchFileForm
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchFileForm.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchFileForm.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    search () {
      this.reloadList()
    },
    /**
     * 查询重置按钮
     */
    searchReset () {
      this.$refs.searchForm.resetFields()
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    fileHandleSelectionChange (val) {
      this.checkDeleteItem = !val.length
      this.multipleSelectionFileIds = val
    },
    /**
     * 批量删除
     */
    remove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionFileIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then(response => {
          if (response.code === 1) {
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 删除行
     *
     * @param index
     * @param rows
     * @param row
     */
    removeItem (index, rows, row) {
      confirmAlert(() => {
        del([JSONBigInt.parse(row.id)]).then(response => {
          if (response.code === 1) {
            rows.splice(index, 1)
            this.reloadList()
            this.$message.success('删除成功')
          }
        })
      })
    },
    /**
     * 创建
     */
    create () {
      this.title = '上传文件'
      this.dialogType = DIALOG_TYPE.ADD
      this.uploadDialogVisible = true
    },
    /**
     * 修改
     *
     * @param row
     */
    edit (row) {
      this.title = '重新上传文件'
      this.dialogType = DIALOG_TYPE.EDIT
      this.uploadDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.file, row)
      })
    },
    /**
     * 详情
     *
     * @param row
     */
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.file, row)
      })
    },
    /**
     * 预览
     *
     * @param row
     */
    preview (row) {
      preview(row.id).then(rep => {
        if (rep.code === 1) {
          this.previewDialogVisible = true
          this.imgUrl = rep.data
        }
      })
    },
    /**
     * 上传
     *
     * @param param
     */
    uploadImage (param) {
      const formData = new FormData()
      if (!this.file.title) {
        this.$refs.uploadFileFrom.validate()
        param.file = null
        return
      }
      if (!this.file.ossStyle) {
        this.$refs.uploadFileFrom.validate()
        param.file = null
        return
      }
      formData.append('file', param.file)
      formData.append('title', this.file.title)
      formData.append('ossStyle', this.file.ossStyle)
      this.file.ossStyle === 1 ? this.uploadMinioS3(formData) : this.uploadLocalStorage(formData)
    },
    uploadMinioS3 (formData) {
      uploadMinioS3(formData).then(response => {
        this.uploadDialogVisible = false
        this.reloadList()
      }).catch(e => {
        console.error('图片上传失败', e)
      })
    },
    uploadLocalStorage (formData) {
      uploadMinioS3(formData).then(response => {
        this.uploadDialogVisible = false
        this.reloadList()
      }).catch(e => {
        console.error('图片上传失败', e)
      })
    },
    /**
     * 下载
     *
     * @param row
     */
    download (row) {
      download(row.id).then(response => {
        const blob = new Blob([response.data], { type: response.data.contentType })
        saveAs(blob, response.data.fileName)
      }).catch(err => {
        console.error('下载失败', err)
      })
    },
    /**
     * 关闭上传弹出框事件
     */
    closeUploadDialog () {
      this.file = this.fileInfo
    },
    /**
     * 关闭详情弹出框事件
     */
    closeInfoDialog () {
      this.file = this.fileInfo
    }
  }
}
</script>