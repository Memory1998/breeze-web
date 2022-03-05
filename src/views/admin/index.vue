<template>
  <el-container style="margin: 0; padding: 0; height: 100%">
    <el-header>
      <Header />
    </el-header>

    <el-container style="height: 93vh; text-align: left">
      <el-aside :width="isCollapse ? '3.5vw' : '15vw'">
        <div class="collapse" @click="collapse">||||</div>
        <el-menu
          :collapse-transition="false"
          :default-active="this.$store.state.editableTabsValue"
          router
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu
            :index="item.menuName"
            v-for="item in menus"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item
              :index="subItem.menuName"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="clickMenu(subItem)"
            >
              <span slot="title">{{ subItem.title }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <Tabs />
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Tabs from "@/components/home/Tabs.vue";
import Header from "@/components/home/Header";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  components: {
    Tabs,
    Header,
  },
  data() {
    return {
      isCollapse: false, // 决定左侧导航栏是否展开
      menus: [
        {
          id: 1,
          title: "系统设置",
          menuName: "System",
          path: "/system",
          children: [
            {
              id: 1.1,
              title: "用户管理",
              menuName: "User",
              path: "/user",
            },
            {
              id: 1.2,
              title: "平台管理",
              menuName: "Platform",
              path: "/platform",
            },
            {
              id: 1.3,
              title: "菜单管理",
              menuName: "Menu",
              path: "/menu",
            },
          ],
        },
      ],
    };
  },
  computed: {},
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    collapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(menu) {
      debugger;
      console.log(menu);
      this.$store.commit("addTab", menu);
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
}

.el-aside {
  color: #333;
  background: #9b9b9b;
  transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -moz-transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -o-transition: width 0.15s;
}

.el-main {
  margin: 0;
  padding: 0;
  text-align: center;
}

.collapse {
  text-align: center;
  color: white;
  letter-spacing: 2px;
  cursor: pointer;
  line-height: 24px;
}
</style>
