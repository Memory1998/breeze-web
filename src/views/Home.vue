<template>
  <el-container style="margin: 0; padding: 0">
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>登出</el-dropdown-item>
          <el-dropdown-item>设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>admin</span>
    </el-header>

    <el-container style="height: 90vh">
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

      <el-main>Main</el-main>
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
          authName: "一级路由",
          path: "router",
          children: [
            {
              authName: "二级路由",
              path: "router",
            },
          ],
        },
      ],
    };
  },
  computed: {},
  methods: {},
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
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
