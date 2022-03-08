<template>
  <el-header>
    <div class="menu">
<!--      <el-menu style="display: none;" :default-active="activeIndex" class="el-menu-demo" mode="horizontal"-->
<!--               @select="handleSelect">-->
<!--        <el-menu-item index="1">处理中心</el-menu-item>-->
<!--        <el-submenu index="2">-->
<!--          <template slot="title">我的工作台</template>-->
<!--          <el-menu-item index="2-1">选项1</el-menu-item>-->
<!--          <el-menu-item index="2-2">选项2</el-menu-item>-->
<!--          <el-menu-item index="2-3">选项3</el-menu-item>-->
<!--          <el-submenu index="2-4">-->
<!--            <template slot="title">选项4</template>-->
<!--            <el-menu-item index="2-4-1">选项1</el-menu-item>-->
<!--            <el-menu-item index="2-4-2">选项2</el-menu-item>-->
<!--            <el-menu-item index="2-4-3">选项3</el-menu-item>-->
<!--          </el-submenu>-->
<!--        </el-submenu>-->
<!--        <el-menu-item index="3" disabled>消息中心</el-menu-item>-->
<!--        <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
<!--      </el-menu>-->
    </div>
    <div class="logout">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <span>admin</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">登出</el-dropdown-item>
          <el-dropdown-item command="setting">设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {}
  },
  methods: {
    handleCommand (command) {
      if (command === 'logout') {
        this.$message({
          showClose: true,
          message: '',
          type: 'success'
        })
        localStorage.removeItem('access_token')
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #FFFFFF;
  position: relative;
  border-bottom: rgba(48, 49, 51, 0.09) solid 1px;

  > .logout {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    position: absolute;
    right: 0;
    width: 5%;
    height: 100%;
    text-align: center;
    justify-content: center;
    color: #FFFFFF!important;
  }
}
</style>
