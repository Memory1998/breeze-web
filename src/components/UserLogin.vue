<template>
  <div class="userLogin">
    <el-form :model="formLogin">
      <el-form-item>
        <el-input v-model="formLogin.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formLogin.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="onSubmit">{{
          loginBtn
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "userLogin",
  data() {
    return {
      loginBtn: "登录",
      formLogin: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
