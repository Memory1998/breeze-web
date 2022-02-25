<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    closable
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="(item, index) in editableTabs"
      :key="index"
      :label="item.title"
      :name="item.name"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Tabs",
  data() {
    return {
      tabIndex: 1,
    };
  },
  computed: {
    editableTabsValue: {
      get() {
        return this.$store.state.editableTabsValue;
      },
      set(tab) {
        this.$store.state.editableTabsValue = tab;
      },
    },
    editableTabs: {
      get() {
        return this.$store.state.editableTabs;
      },
      set(tab) {
        this.$store.state.editableTabs = tab;
      },
    },
  },
  methods: {
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
  },
};
</script>
<style lang="less" scoped></style>
