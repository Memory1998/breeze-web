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

    <el-container style="height: 93vh">
      <el-aside width="15vw">
        <div class="collapase" @click="collapase">||||</div>
        <el-menu router>
          <el-submenu
            :index="item.id + ''"
            v-for="item in menus"
            :key="item.id"
          >
            <template slot="title">
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <span slot="title">{{ subItem.authName }}</span>
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
      handleOpen: false,
      handleClose: false,
      menus: [
        {
          authName: "系统设置",
          path: "/",
          children: [
            {
              authName: "用户管理",
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
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.collapase {
  color: white;
  letter-spacing: 2px;
  text-align: center;
  cursor: pointer;
  line-height: 24px;
}
</style>
