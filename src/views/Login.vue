<template>
  <div class="loign">
    <UserLogin/>
  </div>
</template>

<script>
// @ is an alias to /src
import UserLogin from "@/components/UserLogin.vue";

export default {
  name: "Login",
  components: {
    UserLogin,
  },
};
</script>
