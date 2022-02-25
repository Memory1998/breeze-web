<template>
  <div>
    <el-form
      :rules="rules"
      :model="userLogin"
      ref="userLogin"
      class="userLogin"
    >
      <h3>登录</h3>
      <el-form-item prop="username">
        <el-input
          type="text"
          auto-complete="false"
          v-model="userLogin.username"
          placeholder="账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          auto-complete="false"
          v-model="userLogin.password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%" type="primary" @click="onSubmit"
          >{{ loginBtn }}
        </el-button>
      </el-form-item>
    </el-form>

    <Verify
      @success="success"
      :mode="'pop'"
      :captchaType="'blockPuzzle'"
      :imgSize="{ width: '330px', height: '155px' }"
      ref="verify"
    ></Verify>
  </div>
</template>

<script>
import Verify from "@/components/verifition/Verify";
import { token } from "@/api/login";

export default {
  name: "userLogin",
  components: {
    Verify,
  },
  data() {
    return {
      loginBtn: "登录",
      userLogin: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入登录账户", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    success(params) {
      console.log(params);
      token(this.userLogin).then((response) => {
        localStorage.setItem("access_token", response.access_token);
        this.$router.push("home");
      });
    },
    onSubmit() {
      this.$refs.userLogin.validate((valid) => {
        if (valid) {
          this.$refs.verify.show();
        } else {
          this.$message({
            showClose: true,
            message: "登录失败",
            type: "error",
          });
          localStorage.removeItem("access_token");
          return false;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.userLogin {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 30vh auto;
  padding: 2vh 2vw;
  width: 18vw;
  border: 1px #eaeaea solid;
  box-shadow: 0 0 25px #9b9b9b;
}

.userLogin > h3 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
