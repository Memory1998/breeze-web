<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchTenant" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="租户名称" prop="tenantName">
              <el-input v-model="searchTenant.tenantName" clearable placeholder="租户名称"/>
            </el-form-item>
            <el-form-item label="租户编码" prop="tenantCode">
              <el-input v-model="searchTenant.tenantCode" clearable placeholder="租户编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:tenant:create']" plain size="mini" type="primary" @click="handleCreate">新建</el-button>
        <el-button v-has="['sys:tenant:delete']" :disabled="checkDelete" plain size="mini" type="danger"
                   @click="handleRemove">删除
        </el-button>
      </div>
      <el-table
        ref="tenantTable"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="tenantTableData"
        border
        empty-text="无数据"
        size="mini"
        stripe
        @selection-change="handleTenantSelectionChange">
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
          label="租户名称"
          prop="tenantName"
          show-overflow-tooltip
          width="200">
        </el-table-column>
        <el-table-column
          label="租户编码"
          prop="tenantCode"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createName">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleInfo(scope.row)">查看</el-button>
            <el-button v-has="['sys:tenant:modify']" size="mini" type="text" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-has="['sys:tenant:delete']" size="mini" type="text"
                       @click.native.prevent="handleRemoveItem(scope.$index, tenantTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 2vh;">
        <el-pagination
          :current-page="searchTenant.current"
          :page-size="searchTenant.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog :title="title" :visible.sync="tenantDialogVisible" width="40vw"
               @close="handleCloseTenantDialog('tenantForm')">
      <el-form ref="tenantForm" :model="tenant" :rules="tenantRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="租户名称" prop="tenantName">
          <el-input v-model="tenant.tenantName" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="租户编码" prop="tenantCode">
          <el-input v-model="tenant.tenantCode" autocomplete="off" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelTenantForm('tenantForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitTenantForm('tenantForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="handleCloseInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="租户名称">
          {{ tenant.tenantName }}
        </el-descriptions-item>
        <el-descriptions-item label="租户编码">
          <el-tag size="small">{{ tenant.tenantCode }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          {{ tenant.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { checkTenantCode, del, list, modify, save } from '@/api/system/tenant'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'

export default {
  name: 'Tenant',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      selectionTenantIds: [],
      // 租户表格数据
      tenantTableData: [],
      // 租户查询条件数据
      searchTenant: {
        tenantName: '',
        tenantCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 租户添加修改弹出框
      tenantDialogVisible: false,
      // 用户添加修改弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 租户添加修改数据
      tenant: {
        id: undefined,
        tenantName: '',
        tenantCode: '',
        description: ''
      },
      // 租户详情数据
      tenantInfo: {
        id: undefined,
        tenantName: '',
        tenantCode: '',
        description: ''
      },
      // 租户添加修改表单规则
      tenantRules: {
        tenantName: [
          {
            required: true,
            message: '请输入租户名称',
            trigger: 'blur'
          }
        ],
        tenantCode: [
          {
            required: true,
            message: '请输入租户编码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              checkTenantCode(value, this.tenant.id).then((response) => {
                if (response.data) {
                  callback()
                  return
                }
                callback(new Error('编码重复'))
              })
            },
            trigger: 'blur'
          }
        ]
      }
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
        if (response.code === 1) {
          this.tenantTableData = response.data.records
          this.searchTenant.size = response.data.size
          this.searchTenant.current = response.data.current
          this.total = response.data.total
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, tenantName: string, size: number, tenantCode: string}}
     */
    buildParam () {
      return this.searchTenant
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchTenant.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchTenant.current = current
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
     * 租户表格复选框事件
     *
     * @param val
     */
    handleTenantSelectionChange (val) {
      this.checkDelete = !val.length
      this.selectionTenantIds = val
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.selectionTenantIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
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
     * 创建
     */
    handleCreate () {
      this.title = '创建租户'
      this.dialogType = DIALOG_TYPE.ADD
      this.tenantDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    handleEdit (row) {
      this.title = '修改租户'
      this.dialogType = DIALOG_TYPE.EDIT
      this.tenantDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.tenant, row)
      })
    },
    /**
     * 详情
     *
     * @param row
     */
    handleInfo (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.tenant, row)
      })
    },
    /**
     * 关闭租户添加修改弹出框事件
     *
     * @param formName
     */
    handleCloseTenantDialog (formName) {
      this.tenant.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.tenant = this.tenantInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    handleSubmitTenantForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.handleSave() : this.handleModify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 保存请求
     */
    handleSave () {
      this.tenant.id = undefined
      save(this.tenant).then((response) => {
        if (response.code === 1) {
          this.$message.success('添加成功')
          this.tenantDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    handleModify () {
      modify(this.tenant).then((response) => {
        if (response.code === 1) {
          this.$message.success('修改成功')
          this.tenantDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    handleCancelTenantForm (formName) {
      this.tenantDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
