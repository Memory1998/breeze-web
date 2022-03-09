<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(item, index) in breads" :key="index" :to="{ path: item.name }">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data () {
    return {
    }
  },
  computed: {
    breads: {
      get () {
        return this.$store.state.breads
      },
      set (breads) {
        this.$store.state.breads = breads
      }
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>

</style>
