<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchRole" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="searchRole.roleName" clearable placeholder="角色名称"/>
            </el-form-item>
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model="searchRole.roleCode" clearable placeholder="角色编码"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch()">查询</el-button>
              <el-button type="info" @click="handleSearchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="24">
        <el-col :md="19">
          <div style="margin-bottom: 10px; text-align: left;">
            <el-button v-has="['sys:role:create']" plain size="mini" type="primary" @click="handleCreate">新建
            </el-button>
            <el-button v-has="['sys:role:delete']" :disabled="checkDelete" plain size="mini" type="danger"
                       @click="handleRemove">删除
            </el-button>
          </div>
          <el-table
            ref="roleTable"
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
            :data="roleTableData"
            border
            row-key="id"
            size="mini"
            stripe
            @row-click="handelRowClick"
            @selection-change="handleRoleSelectionChange">
            <el-table-column
              type="selection"
              width="55"/>
            <el-table-column
              v-if="false"
              label="ID"
              prop="id"
              width="200"/>
            <el-table-column
              label="角色名称"
              prop="roleName"/>
            <el-table-column
              label="角色编码"
              prop="roleCode"/>
            <el-table-column
              label="数据权限名称"
              prop="permissionName"/>
            <el-table-column>
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handeInfo(scope.row)">查看</el-button>
                <el-button v-has="['sys:role:modify']" size="mini" type="text" @click="handleEdit(scope.row)">编辑
                </el-button>
                <el-button v-has="['sys:permission:edit']" size="mini" type="text"
                           @click="handleEditRolePermission(scope.row)">数据权限
                </el-button>
                <el-button v-has="['sys:role:delete']" size="mini" type="text"
                           @click.native.prevent="handleRemoveItem(scope.$index, roleTableData,scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div style="text-align: right;margin-top: 2vh;">
            <el-pagination
              :current-page="searchRole.current"
              :page-size="searchRole.size"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </el-col>
        <el-col :md="5" style="min-width: 10vw">
          <el-tree ref="roleTree"
                   :check-strictly="true"
                   :data="roleTreeData"
                   :props="roleTreeProps"
                   node-key="id"
                   show-checkbox
                   style="height: 560px; overflow-y:scroll; border: #e1e1e1 1px solid; margin-top:37px;">
          </el-tree>
          <div style="margin-top: 10px; text-align: center; padding: 0 30px;">
            <el-button plain size="mini" type="primary" @click="handleSubmitPermission">提交</el-button>
            <el-button :disabled="disabled" plain size="mini" type="info" @click="handleResetPermission">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog :title="title" :visible.sync="roleDialogVisible" width="40vw"
               @close="handleCloseRoleDialog('roleForm')">
      <el-form ref="roleForm" :model="role" :rules="roleRules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="角色名称" prop="roleName">
          <el-input v-model="role.roleName" autocomplete="off" clearable/>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item :label-width="formLabelWidth" label="角色编码" prop="roleCode">
              <el-input v-model="role.roleCode" autocomplete="off" clearable>
                <template slot="prepend">{{ prefix }}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="6" style="color: red; padding: 10px;">
            {{ prefix }}{{ role.roleCode }}
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelRoleForm('roleForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitRoleForm('roleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="permissionDialogVisible" width="500px"
               @close="handleClosePermissionDialog('permissionForm')">
      <el-form ref="permissionForm" :model="permission" :rules="permissionRule" size="mini">
        <el-form-item :label-width="formLabelWidth" label="数据权限" prop="permissionId">
          <el-select v-model="permission.permissionId" collapse-tags filterable multiple placeholder="请选择数据权限">
            <el-option
              v-for="item in permissionOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCancelPermissionForm('permissionForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitPermissionForm('permissionForm')">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="handleCloseInfoDialog">
      <el-descriptions :column="1" border size="mini">
        <el-descriptions-item label="角色编码">
          {{ role.roleCode }}
        </el-descriptions-item>
        <el-descriptions-item label="角色名称">
          <el-tag size="small">{{ role.roleName }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </base-container>
</template>

<script>
import { checkRoleCode, del, list, listRolesPermission, modify, modifyPermission, save } from '@/api/system/role'
import { listTreePermission } from '@/api/system/menu'
import { confirmAlert, reLoginConfirm } from '@utils/common'
import { DIALOG_TYPE } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import { editRolePermission, selectPermission } from '@/api/system/permission'

export default {
  name: 'Role',
  data () {
    return {
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 编码前缀
      prefix: 'ROLE_',
      // 是否锁定重置按钮
      disabled: true,
      // 单元格选中数据
      selectionRoleIds: [],
      // 数据权限下拉框
      permissionOptions: [],
      // 数据权限添加修改数据
      permission: {
        roleId: undefined,
        permissionId: []
      },
      // 角色表格数据
      roleTableData: [],
      // 角色查询条件数据
      searchRole: {
        roleName: '',
        roleCode: '',
        current: 1,
        size: 10
      },
      // 分页总数
      total: 0,
      // 树形角色数据
      roleTreeData: [],
      // 角色树形配置
      roleTreeProps: {
        children: 'children',
        label: 'title'
      },
      // 标记删除按钮是否可以点击
      checkDelete: true,
      // 当前选择的角色
      currentClickRoleId: undefined,
      // 角色添加修改弹出框
      roleDialogVisible: false,
      // 角色详情弹出框
      infoDialogVisible: false,
      // 数据权限设置弹出框
      permissionDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 角色添加修改弹出框
      role: {
        id: undefined,
        roleName: '',
        roleCode: ''
      },
      // 角色详情弹出框
      roleInfo: {
        id: undefined,
        roleName: '',
        roleCode: ''
      },
      // 角色添加修改表单规则
      roleRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleCode: [
          {
            required: true,
            message: '请输入角色编码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              checkRoleCode(value, this.role.id).then((response) => {
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
      },
      // 数据权限表单规则
      permissionRule: {
        permissionId: [
          {
            required: true,
            message: '请选择数据数据权限规则',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created () {
    // 初始化加载表格数据
    this.reloadList()
    this.reloadListTreeMenu()
    this.selectDataPermission()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.roleTableData = rep.data.records
          this.searchRole.size = rep.data.size
          this.searchRole.current = rep.data.current
          this.total = rep.data.total
        }
      })
    },
    /**
     * 初始化加载树形数据
     */
    reloadListTreeMenu () {
      listTreePermission().then((rep) => {
        this.roleTreeData = rep.data
      })
    },
    /**
     * 初始化加载树形数据选的值
     */
    listRolesPermission (roleId) {
      if (!roleId) {
        return
      }
      listRolesPermission(roleId).then((rep) => {
        this.$nextTick(() => {
          this.$refs.roleTree.setCheckedKeys([])
          rep.data.forEach(data => {
            this.$refs.roleTree.setChecked(data.menuId, true, false)
          })
        })
        this.disabled = false
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{current: number, size: number, roleCode: string, roleName: string}}
     */
    buildParam () {
      return this.searchRole
    },
    /**
     * 分页大小切换
     *
     * @param size
     */
    handleSizeChange (size) {
      this.searchRole.size = size
      this.reloadList()
    },
    /**
     * 当前页切换
     *
     * @param current
     */
    handleCurrentChange (current) {
      this.searchRole.current = current
      this.reloadList()
    },
    /**
     * 查询按钮
     */
    handleSearch () {
      this.reloadList()
      this.reloadListTreeMenu()
    },
    /**
     * 查询重置按钮
     */
    handleSearchReset () {
      this.$refs.searchForm.resetFields()
      this.handleSearch()
    },
    /**
     * 平台表格复选框事件
     *
     * @param val
     */
    handleRoleSelectionChange (val) {
      this.checkDelete = !val.length
      this.selectionRoleIds = val
    },
    /**
     * 单元格点击事件
     *
     * @param row
     * @param column
     * @param event
     */
    handelRowClick (row, column, event) {
      this.currentClickRoleId = row.id
      this.listRolesPermission(row.id)
    },
    /**
     * 批量删除
     */
    handleRemove () {
      confirmAlert(() => {
        const ids = []
        this.selectionRoleIds.map((x) => ids.push(JSONBigInt.parse(x.id)))
        del(ids).then((rep) => {
          if (rep.code === 1) {
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
        del([JSONBigInt.parse(row.id)]).then(rep => {
          if (rep.code === 1) {
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
      this.title = '创建角色'
      this.dialogType = DIALOG_TYPE.ADD
      this.roleDialogVisible = true
    },
    /**
     * 修改
     * @param row
     */
    handleEdit (row) {
      this.title = '修改角色信息'
      this.dialogType = DIALOG_TYPE.EDIT
      this.roleDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.role, row)
        this.role.roleCode = this.role.roleCode.replace(this.prefix, '')
      })
    },
    /**
     * 详情
     * @param row
     */
    handeInfo (row) {
      this.title = '查看角色信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.infoDialogVisible = true
      this.$nextTick(() => {
        Object.assign(this.role, row)
      })
    },
    /**
     * 关闭角色添加修改弹出框事件
     *
     * @param formName
     */
    handleCloseRoleDialog (formName) {
      this.role.id = undefined
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭详情弹出框事件
     */
    handleCloseInfoDialog () {
      this.role = this.roleInfo
    },
    /**
     * 添加修改弹出框提交
     *
     * @param formName
     */
    handleSubmitRoleForm (formName) {
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
      this.role.roleCode = this.prefix + this.role.roleCode
      save(this.role).then((rep) => {
        if (rep.code === 1) {
          this.$message.success(rep.message)
          this.roleDialogVisible = false
          this.reloadList()
          this.handleResetPermission()
        }
      })
    },
    /**
     * 修改请求
     */
    handleModify () {
      this.role.roleCode = this.prefix + this.role.roleCode
      modify(this.role).then((rep) => {
        if (rep.code === 1) {
          this.$message.success(rep.message)
          this.roleDialogVisible = false
          this.reloadList()
          this.handleResetPermission()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     *
     * @param formName
     */
    handleCancelRoleForm (formName) {
      this.roleDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 提交角色的权限
     */
    handleSubmitPermission () {
      const checkedKeys = this.$refs.roleTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.roleTree.getHalfCheckedKeys()
      if (halfCheckedKeys.length > 0) {
        checkedKeys.push(...halfCheckedKeys)
      }
      if (checkedKeys.length <= 0) {
        this.$message.warning('请选择角色权限')
        return
      }
      if (this.currentClickRoleId === undefined) {
        this.$message.warning('请先点击角色')
        return
      }
      modifyPermission({
        roleId: this.currentClickRoleId,
        permissionIds: checkedKeys
      }).then(rep => {
        if (rep.code === 1) {
          this.$message.success(rep.message)
          this.listRolesPermission(this.currentClickRoleId)
          reLoginConfirm('请重新登录')
        }
      })
    },
    /**
     * 重置角色权限
     */
    handleResetPermission () {
      this.listRolesPermission(this.currentClickRoleId)
    },
    /**
     * 编辑数据权限
     *
     * @param row
     */
    handleEditRolePermission (row) {
      this.title = '编辑角色数据权限'
      this.permissionDialogVisible = true
      this.permission.roleId = row.id
    },
    /**
     * 提交数据权限
     *
     * @param formName
     */
    handleSubmitPermissionForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = []
          this.permission.permissionId.forEach(id => {
            data.push({
              permissionId: JSONBigInt.parse(id),
              roleId: JSONBigInt.parse(this.permission.roleId)
            })
          })
          editRolePermission(data).then(rep => {
            if (rep.code === 1 && !rep.data) {
              this.$message({
                message: '数据权限编辑成功',
                type: 'success'
              })
              this.permissionDialogVisible = false
              this.reloadList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 重置数据权限表单
     *
     * @param formName
     */
    handleCancelPermissionForm (formName) {
      this.permissionDialogVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 关闭数据权限配置弹出框事件
     *
     * @param formName
     */
    handleClosePermissionDialog (formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * 数据权限下拉框
     */
    selectDataPermission () {
      selectPermission().then(rep => {
        if (rep.code === 1) {
          this.permissionOptions = rep.data
        }
      })
    }
  }
}
</script>
