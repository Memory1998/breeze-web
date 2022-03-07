import Vue from 'vue'
import VueRouter from 'vue-router'
import { menuTree } from '@/api/menu'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home'),
    children: [
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/admin/user')
      },
      {
        path: '/platform',
        name: 'Platform',
        component: () => import('../views/admin/platform')
      },
      {
        path: '/menu',
        name: 'Menu',
        component: () => import('../views/admin/menu')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
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

export const initMenu = () => {
  menuTree().then((response) => {
    if (!response.data) {
      return
    }
    debugger
    const routeTemp = filterMenu(response.data, routes)
    console.log(routeTemp)
  })
}

initMenu()

export default router
