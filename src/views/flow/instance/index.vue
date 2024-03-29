<template>
  <el-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchInstance" class="demo-form-inline" label-width="100px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="流程实例名称" prop="instanceName">
              <el-input v-model="searchInstance.instanceName" clearable placeholder="流程实例名称"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="instanceTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="instanceTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe>
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          label="ID"
          prop="id"
          show-overflow-tooltip/>
        <el-table-column
          label="流程定义名称"
          prop="name"
          width="200"/>
        <el-table-column
          label="KEY"
          prop="key"
          width="200">
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.key }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="发起人"
          prop="startUserName"
          show-overflow-tooltip
          width="200"/>
        <el-table-column
          label="流程实例版本"
          prop="version"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag size="mini">
              {{ scope.row.version }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="租户"
          prop="tenantId"
          show-overflow-tooltip/>
        <el-table-column
          label="发起时间"
          prop="startTime"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['flow:instance:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, instanceTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchInstance.current"
          :page-size="searchInstance.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="handleCloseInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="流程实例名称">
          {{ instance.instanceName }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </el-container>
</template>

<script>
import { del, list } from '@/api/flow/instance'
import { DIALOG_TYPE } from '@/const/constant'
import { confirmAlert } from '@utils/common'
import JSONBigInt from 'json-bigint'

export default {
  name: 'Instance',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 流程实例表格数据
      instanceTableData: [],
      // 流程实例查询条件数据
      searchInstance: {
        instanceName: '',
        instanceCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 流程实例详情弹出框
      infoDialogVisible: false,
      // 流程实例添加修改数据
      instance: {
        id: undefined
      },
      // 流程实例详情数据
      instanceInfo: {
        id: undefined
      },
      // 流程实例添加修改表单规则
      instanceRules: {}
    }
  },
  created () {
    // 初始化加载表格数据
    this.reloadList()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((response) => {
        this.instanceTableData = response.data.records
        this.searchInstance.size = response.data.size
        this.searchInstance.current = response.data.current
        this.total = response.data.total
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, instanceName: string, instanceCode: string}}
     */
    buildParam () {
      return this.searchInstance
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchInstance.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchInstance.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    handleSearch () {
      this.reloadList()
    },
    /**
     * 查询重置按钮
     */
    handleSearchReset () {
      this.$refs.searchForm.resetFields()
      this.reloadList()
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.multipleSelectionCategoryIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
    handleRemoveItem (index, rows, row) {
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
     * 详情
     *
     * @param row
     */
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.instance, row)
      })
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.instance = this.instanceInfo
    }
  }
}
</script>
