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
    <el-menu
      router
      style="border-right: 1px solid #003366"
      background-color="#003366"
      text-color="#CCCCCC"
      active-text-color="#999966"
      :collapse-transition="false"
      :default-active="this.$store.state.editableTabsValue"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose">
      <el-menu-item
        background-color="#509EFF"
        index="Welcome"
        key="0">
          <i class="el-icon-s-home"></i>
          <span slot="title">欢迎</span>
      </el-menu-item>
      <el-submenu
        background-color="#509EFF"
        :index="item.name"
        v-for="item in menus"
        :key="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.title }}</span>
        </template>
        <el-menu-item
          :index="subItem.name"
          v-for="subItem in item.children"
          :key="subItem.id"
          @click="clickMenu(subItem)">
          <i :class="subItem.icon"></i>
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
    }
  },
  computed: {
    isCollapse: {
      get () {
        return this.$store.state.isCollapse
      },
      set (isCollapse) {
        this.$store.state.isCollapse = isCollapse
      }
    },
    menus: {
      get () {
        return this.$store.state.menus
      },
      set (menus) {
        this.$store.state.menus = menus
      }
    }
  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    clickMenu (menu) {
      console.log(this.$store.state.menus)
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
  background: #003366;
  transition: width 0.01s;
  -webkit-transition: width 0.01s;
  -moz-transition: width 0.01s;
  -o-transition: width 0.01s;
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
    transition: width 0.01s;
    -webkit-transition: width 0.01s;
    -moz-transition: width 0.01s;
    -o-transition: width 0.01s;
  }
}

</style>
