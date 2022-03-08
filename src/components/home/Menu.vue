<template>
  <el-aside :width="isCollapse ? '3.5vw' : '13vw'" style="height: 100vh; text-align: left;">
    <el-header>
      <div class="logo">
        <img src="../../assets/logo.png" alt=""/>
        <transition name="el-fade-in-linear">
          <span v-show="!isCollapse">后台管理系统</span>
        </transition>
      </div>
    </el-header>
    <div class="collapse" @click="collapse">||||</div>
    <el-menu
      router
      background-color="#409EFF"
      text-color="#303133"
      active-text-color="#FFFFFF"
      :collapse-transition="false"
      :default-active="this.$store.state.editableTabsValue"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu
        background-color="#509EFF"
        :index="item.menuName"
        v-for="item in menus"
        :key="item.id">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">{{ item.title }}</span>
        </template>
        <el-menu-item
          :index="subItem.menuName"
          v-for="subItem in item.children"
          :key="subItem.id"
          @click="clickMenu(subItem)">
          <span slot="title">{{ subItem.title }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      isCollapse: false, // 决定左侧导航栏是否展开
      menus: [
        {
          id: 1,
          title: '系统设置',
          menuName: 'System',
          path: '/system',
          children: [
            {
              id: 1.1,
              title: '用户管理',
              menuName: 'User',
              path: '/user'
            },
            {
              id: 1.2,
              title: '平台管理',
              menuName: 'Platform',
              path: '/platform'
            },
            {
              id: 1.3,
              title: '菜单管理',
              menuName: 'Menu',
              path: '/menu'
            }
          ]
        }
      ]

    }
  },
  methods: {
    collapse () {
      this.isCollapse = !this.isCollapse
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    clickMenu (menu) {
      this.$store.commit('addTab', menu)
    }
  }
}
</script>

<style lang="less" scoped>

.el-header {
  padding: 0;
}

.el-aside {
  background: #409EFF;
  transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -moz-transition: width 0.15s;
  -o-transition: width 0.15s;
}

.logo {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: center;
  height: 100%;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  span {
    width: 5vw;
    margin-left: 15px;
    font-size: 0.9rem;
    transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -moz-transition: width 0.15s;
    -o-transition: width 0.15s;
  }
}

.collapse {
  text-align: center;
  color: white;
  letter-spacing: 2px;
  cursor: pointer;
  line-height: 24px;
}
</style>
