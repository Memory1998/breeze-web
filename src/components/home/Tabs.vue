<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    closable
    @tab-remove="removeTab">
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="index"
      :label="item.title"
      :name="item.name">
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'Tabs',
  data () {
    return {
      tabIndex: 1
    }
  },
  computed: {
    editableTabsValue: {
      get () {
        return this.$store.state.editableTabsValue
      },
      set (editableTabsValue) {
        this.$store.state.editableTabsValue = editableTabsValue
      }
    },
    editableTabs: {
      get () {
        return this.$store.state.editableTabs
      },
      set (editableTabs) {
        this.$store.state.editableTabs = editableTabs
      }
    }
  },
  methods: {
    removeTab (targetName) {
      if (targetName === 'Welcome') {
        return
      }
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.$router.push({ name: activeName })
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    }
  }
}
</script>
<style lang="less" scoped></style>
