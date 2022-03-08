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
      const result =
        state.editableTabs.filter((item) => {
          return item.name === menu.menuName
        }).length > 0

      state.editableTabsValue = menu.menuName
      if (result) {
        return
      }

      state.editableTabs.push({
        title: menu.title,
        name: menu.menuName
      })
    }
  },
  actions: {},
  modules: {}
})
