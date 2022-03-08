import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editableTabsValue: 'Home',
    editableTabs: [
      {
        title: '首页',
        name: 'Home'
      }
    ],
    menuList: [],
    isCollapse: false
  },
  getters: {},
  mutations: {
    setMenuList (state, menus) {
      state.menuList = menus
    },
    setCollapse (state, isCollapse) {
      state.isCollapse = isCollapse
    },
    addTab (state, menu) {
      debugger
      const result =
        state.editableTabs.filter((item) => {
          return item.name === menu.name
        }).length > 0

      state.editableTabsValue = menu.name
      if (result) {
        return
      }

      state.editableTabs.push({
        title: menu.meta.title,
        name: menu.name
      })
    },
    clearTab (state) {
      state.editableTabsValue = 'Home'
      state.editableTabs = [
        {
          title: '首页',
          name: 'Home'
        }
      ]
      state.editableTabs = []
    }
  },
  actions: {},
  modules: {}
})
