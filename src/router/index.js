import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { menuTree } from '@/api/menu'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home'),
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('@/views/Welcome.vue')
      }
      // {
      //   path: '/user',
      //   name: 'User',
      //   component: () => import('../views/admin/user/User')
      // },
      // {
      //   path: '/platform',
      //   name: 'Platform',
      //   component: () => import('../views/admin/platform/Platform')
      // },
      // {
      //   path: '/menu',
      //   name: 'Menu',
      //   component: () => import('../views/admin/menu/Menu')
      // }
    ]
  }
]

const router = new VueRouter({
  routes
})

export const loadRoute = () => {
  menuTree().then((response) => {
    if (!response.data) {
      return
    }
    console.log(response.data)
    debugger
    // 拿到menuList
    store.commit('setMenuList', response.data)
    // console.log(store.state.menus.menuList)
    // 动态绑定路由
    const newRoutes = router.options.routes

    response.data.forEach(menu => {
      if (menu.children) {
        menu.children.forEach(e => {
          // 转成路由
          const route = menuToRoute(e)
          debugger
          // 吧路由添加到路由管理中
          if (route) {
            newRoutes[1].children.push(route)
          }
        })
      }
    })
    router.addRoutes(newRoutes)
  })
}

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken && to.path !== '/') {
    loadRoute()
    next()
  } else {
    if (to.path === '/') {
      next()
    } else {
      next('/')
      Element.Message.error('您还没有登录，请先登录')
    }
  }
})

/**
 *
 * @param userRouter
 * @param allRouter
 * @returns {*[]}
 */
export const filterMenu = (userRouter, allRouter) => {
  debugger
  const routers = []
  allRouter.forEach((allK, allV) => {
    userRouter.forEach((userK, userV) => {
      debugger
      if (userK.name === allK.name) {
        if (userK.children && userK.children.length > 0) {
          filterMenu(allK, allV)
          console.log(userV)
          debugger
        }
        debugger
        routers.push(allK)
      }
    })
  })
  return routers
}

// 导航转成路由
const menuToRoute = (menu) => {
  if (!menu.url) {
    return null
  }

  const route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  route.component = loadView(menu.url)
  return route
}

export const loadView = (view) => {
  console.log(`@/views${view}.vue`)
  return (resolve) => require([`@/views${view}.vue`], resolve)
}

export default router
