import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    editableTabsValue: 'Welcome',
    editableTabs: [
      {
        title: '欢迎',
        name: 'Welcome'
      }
    ],
    menus: [],
    breads: [],
    isCollapse: false
  },
  getters: {},
  mutations: {
    setMenus (state, menus) {
      state.menus = menus
    },
    setCollapse (state, isCollapse) {
      state.isCollapse = isCollapse
    },
    addTab (state, menu) {
      if (menu.name === 'Welcome') {
        menu.title = '欢迎'
      }
      state.editableTabsValue = menu.name
      const result =
        state.editableTabs.filter((item) => {
          return item.name === menu.name
        }).length > 0
      if (result) {
        return
      }

      state.editableTabs.push({
        title: menu.title,
        name: menu.name
      })
    },
    clearTab (state) {
      state.editableTabsValue = 'Welcome'
      state.editableTabs = [
        {
          title: '欢迎',
          name: 'Welcome'
        }
      ]
      state.editableTabs = []
    }
  },
  actions: {},
  modules: {}
})
