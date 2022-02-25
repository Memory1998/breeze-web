<template>
  <div>
    <div>
      <img src="../../assets/logo.png" alt="" />
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
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Header",
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
div {
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
</style>
