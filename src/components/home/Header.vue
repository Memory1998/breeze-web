<template>
  <el-header style="padding-left: 0">
    <div class="menu">
      <div class="collapse" @click="collapse">
        <i v-show="!isCollapse" class="el-icon-s-fold"/>
        <i v-show="isCollapse" class="el-icon-s-unfold"/>
<!--        <el-menu style="display: none;" :default-active="activeIndex" class="el-menu-demo" mode="horizontal"-->
<!--                 @select="handleSelect">-->
<!--          <el-menu-item index="1">处理中心</el-menu-item>-->
<!--          <el-submenu index="2">-->
<!--            <template slot="title">我的工作台</template>-->
<!--            <el-menu-item index="2-1">选项1</el-menu-item>-->
<!--            <el-menu-item index="2-2">选项2</el-menu-item>-->
<!--            <el-menu-item index="2-3">选项3</el-menu-item>-->
<!--            <el-submenu index="2-4">-->
<!--              <template slot="title">选项4</template>-->
<!--              <el-menu-item index="2-4-1">选项1</el-menu-item>-->
<!--              <el-menu-item index="2-4-2">选项2</el-menu-item>-->
<!--              <el-menu-item index="2-4-3">选项3</el-menu-item>-->
<!--            </el-submenu>-->
<!--          </el-submenu>-->
<!--          <el-menu-item index="3" disabled>消息中心</el-menu-item>-->
<!--          <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>-->
<!--        </el-menu>-->
      </div>
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
    return {
      isCollapse: false // 决定左侧导航栏是否展开
    }
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
    },
    collapse () {
      this.isCollapse = !this.isCollapse
      this.$store.commit('setCollapse', this.isCollapse)
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  background-color: #FFFFFF;
  position: relative;
  border-bottom: rgba(48, 49, 51, 0.09) solid 1px;

  .collapse {
    height: 100%;
    width: 88px;
    display: flex;
    align-items: center;
    justify-content: start;
    flex-wrap: nowrap;
    font-size: 30px;
    cursor: pointer;
  }

  > .logout {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: center;
    position: absolute;
    right: 0;
    width: 5%;
    height: 100%;
    text-align: center;
    color: #FFFFFF !important;
  }
}

</style>
