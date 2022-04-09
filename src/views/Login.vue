<template>
  <div class="login">
    <UserLogin />
  </div>
</template>

<script>
import UserLogin from '@/components/UserLogin.vue'

export default {
  name: 'Login',
  components: {
    UserLogin
  }
}
</script>

<style scoped>

.login{
  background: #002a59;
  margin: 0 auto;
  height: 100vh;
  width: 100vw;
}
</style>
