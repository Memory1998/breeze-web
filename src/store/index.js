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
    menuList: []
  },
  getters: {},
  mutations: {
    setMenuList (state, menus) {
      state.menuList = menus
    },
    addTab (state, menu) {
      const result =
        state.editableTabs.filter((item) => {
          return item.name === menu.menuName
        }).length > 0

      if (result) {
        return
      }

      state.editableTabs.push({
        title: menu.title,
        name: menu.menuName
      })
      state.editableTabsValue = menu.menuName
    }
  },
  actions: {},
  modules: {}
})
