<template>
  <el-container style="margin: 0; padding: 0; height: 100%">
    <el-header>
      <div>
        <div>
          <img src="../assets/logo.png" alt="" />
          <span>后台管理系统</span>
        </div>
        <div class="logout">
          <el-dropdown>
            <i class="el-icon-setting"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="logout">登出</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>admin</span>
        </div>
      </div>
    </el-header>

    <el-container style="height: 93vh; text-align: left">
      <el-aside :width="isCollapse ? '3.5vw' : '15vw'">
        <div class="collapse" @click="collapse">||||</div>
        <el-menu
          :collapse-transition="false"
          router
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menus"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.menuName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <span slot="title">{{ subItem.menuName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  data: function () {
    return {
      isCollapse: false, // 决定左侧导航栏是否展开
      menus: [
        {
          id: 1,
          menuName: "系统设置",
          path: "/",
          children: [
            {
              id: 1.1,
              menuName: "用户管理",
              path: "user",
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
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;

  > div {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;

    > div {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;
      justify-content: flex-start;

      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }

      span {
        margin-left: 15px;
      }
    }

    > .logout {
      width: 100%;
      flex-shrink: 25;
    }
  }
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
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.collapse {
  text-align: center;
  color: white;
  letter-spacing: 2px;
  cursor: pointer;
  line-height: 24px;
}
</style>
