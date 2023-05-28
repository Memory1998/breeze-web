<template>
  <base-container>
    <el-main>
      <el-form ref="searchForm" :inline="true" :model="searchMenuForm" class="demo-form-inline" label-width="80px"
               size="mini">
        <el-row :gutter="24" style="text-align: left;">
          <el-col :md="24">
            <el-form-item label="菜单名称" prop="title">
              <el-input v-model="searchMenuForm.title" clearable placeholder="菜单名称"/>
            </el-form-item>
            <el-form-item label="路由名称" prop="name">
              <el-input v-model="searchMenuForm.name" clearable placeholder="路由名称"/>
            </el-form-item>
            <el-form-item label="平台">
              <el-select v-model="searchMenuForm.platformId" placeholder="请选择平台">
                <el-option
                  v-for="item in platformOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button type="info" @click="searchReset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-bottom: 10px; text-align: left;">
        <el-button v-has="['sys:menu:create']" plain size="mini" type="primary" @click="create">新建</el-button>
      </div>
      <el-table
        ref="menuTable"
        :header-cell-style="{ textAlign: 'left' }"
        :cell-style="{ textAlign: 'left' }"
        :data="menuTableData"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
        empty-text="无数据"
        row-key="id"
        size="mini"
        stripe
        @expand-change="menuHandleExpandChange">
        <el-table-column
          v-if="false"
          label="ID"
          prop="id"
          width="200"/>
        <el-table-column
          label="标题"
          prop="title"
          show-overflow-tooltip
          width="180"/>
        <el-table-column
          label="组件名称"
          prop="name"
          show-overflow-tooltip/>
        <el-table-column
          label="排序"
          prop="sort"
          show-overflow-tooltip
          width="50"/>
        <el-table-column
          label="图标"
          prop="icon"
          show-overflow-tooltip
          width="190">
          <template slot-scope="scope">
            <Icon :style="'color: #000;'" :icon-name="scope.row.icon"/>
            <el-tag
              v-if="scope.row.icon"
              disable-transitions
              size="mini"
              type="success">
              {{ scope.row.icon }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="权限编码"
          prop="permission"
          show-overflow-tooltip
          width="180"/>
        <el-table-column
          label="菜单路径"
          prop="path"
          show-overflow-tooltip/>
        <el-table-column
          label="组件路径"
          prop="component"
          show-overflow-tooltip
          width="250"/>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'HREF')"
          label="外部链接"
          prop="href"
          show-overflow-tooltip
          width="100"/>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'KEEPALIVE')"
          label="缓存"
          prop="keepAlive"
          show-overflow-tooltip
          width="100"/>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'HIDDEN')"
          label="是否隐藏"
          prop="hidden"
          show-overflow-tooltip
          width="100"/>
        <el-table-column
          :formatter="(row, column) => this.column()(row, column, 'MENU_TYPE')"
          label="类型"
          prop="type"
          show-overflow-tooltip/>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="info(scope.row)">查看</el-button>
            <el-button v-has="['sys:menu:create']" size="mini" type="text" @click="create(scope.row)">新建</el-button>
            <el-button v-has="['sys:menu:modify']" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="['sys:menu:delete']" size="mini" type="text"
                       @click.native.prevent="delItem(menuTableData,scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-dialog :title="title" :visible.sync="menuDialogVisible" width="40vw"
               @close="closeMenuDialog">
      <el-form ref="menuRuleForm" :model="menu" :rules="rules" size="mini">
        <el-form-item :label-width="formLabelWidth" label="平台" prop="platformId" style="text-align: left;">
          <el-select v-model="menu.platformId" placeholder="请选择所属的平台">
            <el-option
              v-for="item in platformOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="组件类型"
                      style="text-align: left;">
          <el-radio-group v-model="menu.type"
                          @click="menu.type === 2 ? menu.href = 0 : menu.href = 1">
            <el-radio-button
              v-for="item in this.dict()('MENU_TYPE')"
              :key="item.key"
              :label="Number(item.key)">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="menu.type === 1" :label-width="formLabelWidth" label="外链" style="text-align: left;">
          <el-radio-group v-model="menu.href">
            <el-radio-button
              v-for="item in this.dict()('HREF')"
              :key="item.key"
              :label="item.key">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="menu.type === 1" :label-width="formLabelWidth" label="缓存" style="text-align: left;">
          <el-radio-group v-model="menu.keepAlive">
            <el-radio-button
              v-for="item in this.dict()('KEEPALIVE')"
              :key="item.key"
              :label="item.key">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="menu.type === 1" :label-width="formLabelWidth" label="隐藏" style="text-align: left;">
          <el-radio-group v-model="menu.hidden">
            <el-radio-button
              v-for="item in this.dict()('HIDDEN')"
              :key="item.key"
              :label="item.key">
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" class="parentId" label="上级菜单" prop="parentId">
          <el-cascader
            v-model="menu.parentId"
            :options="menuOption"
            :props="{ checkStrictly: true, emitPath: false , value: 'key', label: 'value' }"
            :show-all-levels="false"
            clearable
            filterable
          ></el-cascader>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="排序" prop="sort" style="text-align: left;">
          <el-input-number v-model="menu.sort" :min="1" :step="2" label="排序" @change="handleChangeSort"/>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="标题" prop="title">
          <el-input v-model="menu.title" autocomplete="off" clearable placeholder="请输入组件显示的标题"/>
        </el-form-item>

        <el-form-item v-if="menu.type === 0 || menu.type === 1" :label-width="formLabelWidth" label="组件图标"
                      prop="icon">
          <el-button plain style="margin:0 10px" type="success" @click="showIconDialog">打开</el-button>
          <Icon :icon-name="menu.icon"/>
          <span> {{ menu.icon }} </span>
        </el-form-item>

        <el-form-item v-if="menu.type === 0 || menu.type === 1" :label-width="formLabelWidth"
                      label="菜单路径"
                      prop="path">
          <el-input v-model="menu.path" autocomplete="off" clearable placeholder="请输入菜单路径"/>
        </el-form-item>

        <el-form-item v-if="menu.href === 0 && menu.type === 1" :label-width="formLabelWidth" label="组件名称"
                      prop="name">
          <el-input v-model="menu.name" autocomplete="off" clearable placeholder="请输入组件名称"/>
        </el-form-item>

        <el-form-item v-if="menu.href === 0 && menu.type === 1" :label-width="formLabelWidth" label="组件路径"
                      prop="component">
          <el-input v-model="menu.component" autocomplete="off" clearable placeholder="请输入组件路径"/>
        </el-form-item>

        <el-form-item v-if="menu.href === 0 && (menu.type === 1 || menu.type === 2)" :label-width="formLabelWidth"
                      label="权限编码"
                      prop="permission">
          <el-input v-model="menu.permission" autocomplete="off" clearable placeholder="请输入权限编码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetMenuForm">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('menuRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="infoDialogVisible" width="40vw"
               @close="closeInfoDialog">
      <el-descriptions :column="2" border size="mini">
        <el-descriptions-item label="平台名称">
          {{ menu.platformName }}
        </el-descriptions-item>

        <el-descriptions-item>
          {{ this.descriptions()(menu, 'type', 'MENU_TYPE') }}
        </el-descriptions-item>

        <el-descriptions-item label="外部链接">
          <el-tag
            :type="menu.href === 0 ? 'primary' :  'info'"
            disable-transitions>
            {{ this.descriptions()(menu, 'href', 'HREF') }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="缓存">
          {{ this.descriptions()(menu, 'keepAlive', 'KEEPALIVE') }}
        </el-descriptions-item>

        <el-descriptions-item label="隐藏">
          {{ this.descriptions()(menu, 'hidden', 'HIDDEN') }}
        </el-descriptions-item>

        <el-descriptions-item label="上级菜单">
          <el-cascader
            v-model="menu.parentId"
            :options="menuOption"
            :props="{ checkStrictly: true, emitPath: false , value: 'key', label: 'value' }"
            :show-all-levels="false"
            clearable
            disabled
            filterable
            size="mini"
          ></el-cascader>
        </el-descriptions-item>

        <el-descriptions-item label="排序">
          {{ menu.sort }}
        </el-descriptions-item>

        <el-descriptions-item label="标题">
          {{ menu.title }}
        </el-descriptions-item>

        <el-descriptions-item v-if="menu.type === 1" label="图标">
          <Icon :icon-name="menu.icon" style="font-size: 20px;"/>
          <span>
            {{ menu.icon }}
          </span>
        </el-descriptions-item>

        <el-descriptions-item label="路由名称">
          {{ menu.name }}
        </el-descriptions-item>

        <el-descriptions-item label="组件路径">
          <el-tag v-if="menu.path && menu.path !== ''" type="primary"> {{ menu.path }}</el-tag>
          <span v-else>{{ menu.path }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="权限编码">
          <el-tag v-if="menu.permission !== ''" type="primary">
            {{ menu.permission }}
          </el-tag>
          <span v-else>{{ menu.permission }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <Icon-dialog
      ref="iconDialog"
      type="iconfont"
      @choiceIcon="choiceIcon"/>
  </base-container>
</template>

<script>
import { del, list, modify, save, selectMenu, selectPlatform } from '@/api/system/menu'
import { confirmAlert } from '@utils/common'
import { DIALOG_TYPE, ROOT } from '@/const/constant'
import JSONBigInt from 'json-bigint'
import IconDialog from '@/components/icon/IconDialog'
import { dict } from '@/mixins'

export default {
  name: 'Menu',
  components: {
    IconDialog
  },
  mixins: [dict],
  data () {
    return {
      // 此页面需要字典编码
      dictCode: ['HIDDEN', 'HREF', 'KEEPALIVE', 'MENU_TYPE'],
      // 当前操作类型
      dialogType: DIALOG_TYPE.ADD,
      // 弹出框标题
      title: '',
      // 单元格选中数据
      multipleSelectionMenuId: [],
      // 菜单表格数据
      menuTableData: [],
      // 平台下拉框数据
      platformOptions: [],
      // 菜单下拉框数据
      menuOption: [],
      // 菜单查询条件数据
      searchMenuForm: {
        platformId: ROOT,
        name: '',
        title: ''
      },
      // 菜单添加修改弹出框
      menuDialogVisible: false,
      // 菜单详情弹出框
      infoDialogVisible: false,
      // 表单标题宽度
      formLabelWidth: '80px',
      // 菜单添加修改数据
      menu: {
        id: undefined,
        platformId: ROOT,
        platformName: '',
        name: '',
        title: '',
        icon: '',
        sort: 0,
        parentId: ROOT,
        permission: '',
        component: '',
        href: 0,
        keepAlive: 0,
        hidden: 0,
        type: 0,
        path: ''
      },
      // 菜单详情数据
      menuInfo: {
        id: undefined,
        platformId: ROOT,
        platformName: '',
        name: '',
        title: '',
        icon: '',
        sort: 0,
        parentId: ROOT,
        permission: '',
        component: '',
        href: 0,
        keepAlive: 0,
        hidden: 0,
        type: 0,
        path: ''
      },
      // 菜单添加修改表单规则
      rules: {
        platformId: [
          {
            required: true,
            message: '请选择平台',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '请输入组件的标题',
            trigger: 'blur'
          }
        ],
        permission: [
          {
            required: false,
            message: '请输入权限编码',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '请输入路径',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '请输入组件路径',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.selectPlatform()
    this.reloadList()
  },
  mounted () {
    this.$refs.menuTable.doLayout()
  },
  methods: {
    /**
     * 初始化加载表格数据
     */
    reloadList () {
      list(this.buildParam()).then((rep) => {
        if (rep.code === 1) {
          this.menuTableData = rep.data
        }
      })
    },
    /**
     * 构造查询条件
     *
     * @returns {{name: string, platformId: string, title: string}}
     */
    buildParam () {
      return this.searchMenuForm
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
     * 删除行
     *
     * @param rows
     * @param row
     */
    delItem (rows, row) {
      confirmAlert(() => {
        del(JSONBigInt.parse(row.id)).then(rep => {
          if (rep.code === 1) {
            this.deleteTreeTableData(rows, row)
          }
        })
      })
    },
    /**
     * 删除树形数据
     *
     * @param rows
     * @param row
     */
    deleteTreeTableData (rows, row) {
      for (let index = 0; index < rows.length; index++) {
        if (rows[index].id === row.id) {
          rows.splice(index, 1)
          return
        }
        const tempTable = rows[index]
        if (tempTable.children && tempTable.children.length > 0) {
          this.deleteTreeTableData(tempTable.children, row)
        }
      }
    },
    /**
     * 树形展开重置布局
     *
     * @param val
     */
    menuHandleExpandChange (val) {
      this.multipleSelectionMenuId = val
      this.$nextTick(() => {
        this.$refs.menuTable.doLayout()
      })
    },
    /**
     * 创建
     */
    create (row) {
      this.title = '创建菜单'
      this.dialogType = DIALOG_TYPE.ADD
      this.$nextTick(() => {
        this.menu.parentId = row.id ? row.id : ''
        this.selectMenu()
      })
      this.menuDialogVisible = true
    },
    /**
     * 克隆
     */
    clone () {
      this.title = '创建菜单'
      // TODO
    },
    /**
     * 修改
     * @param row
     */
    edit (row) {
      this.title = '修改菜单'
      this.dialogType = DIALOG_TYPE.EDIT
      this.$nextTick(() => {
        Object.assign(this.menu, row)
        this.menu.parentId = row.parentId
        this.selectMenu(this.menu.id)
        this.selectPlatform()
      })
      this.menuDialogVisible = true
    },
    /**
     * 详情
     * @param row
     */
    info (row) {
      this.title = '查看信息'
      this.dialogType = DIALOG_TYPE.SHOW
      this.$nextTick(() => {
        Object.assign(this.menu, row)
        this.menu.parentId = row.parentId
        this.selectMenu()
        this.selectPlatform()
      })
      this.infoDialogVisible = true
    },
    /**
     * 关闭菜单添加修改弹出框事件
     */
    closeMenuDialog () {
      this.$nextTick(() => {
        Object.assign(this.menu, this.menuInfo)
      })
    },
    /**
     * 关闭详情弹出框事件
     */
    closeInfoDialog () {
      this.$nextTick(() => {
        Object.assign(this.menu, this.menuInfo)
      })
    },
    /**
     * 添加修改弹出框提交
     * @param formName
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogType === DIALOG_TYPE.ADD ? this.save() : this.modify()
        } else {
          console.log('error submit!!')
        }
      })
    },
    /**
     * 保存请求
     */
    save () {
      save(this.menu).then((rep) => {
        if (rep.code === 1) {
          this.$message.success(rep.message)
          this.menuDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 修改请求
     */
    modify () {
      modify(this.menu).then((rep) => {
        if (rep.code === 1) {
          this.$message.success(rep.message)
          this.menuDialogVisible = false
          this.reloadList()
        }
      })
    },
    /**
     * 添加修改弹出框重置
     */
    resetMenuForm () {
      this.menuDialogVisible = false
    },
    /**
     * 打卡icon选择弹出框
     */
    showIconDialog () {
      this.$refs.iconDialog.showIconDialog({})
    },
    /**
     * 选择icon事件
     * @param val
     */
    choiceIcon (val) {
      this.menu.icon = val
    },
    /**
     * 平台下拉框
     */
    selectPlatform () {
      selectPlatform().then((rep) => {
        if (rep.code === 1) {
          this.platformOptions = rep.data
        }
      }).catch((e) => {
        console.error(e)
      })
    },
    /**
     * 菜单下拉框
     *
     * @param id
     */
    selectMenu (id) {
      selectMenu(id || 0).then(response => {
        if (response.code === 1 && response.data) {
          this.menuOption = [{
            key: ROOT,
            value: '根节点',
            children: response.data
          }]
        }
      })
    },
    /**
     * @param val
     */
    handleChangeSort (val) {
    }
  }
}
</script>