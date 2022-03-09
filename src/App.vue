<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    /**
     * 监听
     * @param to
     * @param from
     */
    $route (to, from) {
      const accessToken = localStorage.getItem('access_token')
      if (to.name !== 'Login' && to.name !== 'Home' && accessToken) {
        console.log(from)
        this.$store.commit('addTab', {
          name: to.name,
          title: to.meta.title
        })
      }
      console.log(this.$store.state.editableTabs)
    }
  }
}
</script>
<style>
* {
  padding: 0;
  margin: 0;
}
</style>
