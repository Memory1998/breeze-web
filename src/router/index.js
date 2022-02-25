import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Element from "element-ui";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/Home.vue"),
    children: [
      {
        path: "/user",
        name: "User",
        component: () => import("../views/user/User.vue"),
      },
      {
        path: "/platform",
        name: "Platform",
        component: () => import("../views/platform/Platform.vue"),
      },
      {
        path: "/menu",
        name: "Menu",
        component: () => import("../views/menu/Menu.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  let access_token = localStorage.getItem("access_token");
  if (access_token) {
    next();
  } else {
    if (to.path == "/") {
      next();
    } else {
      next("/");
      Element.Message.error("您还没有登录，请先登录");
    }
  }
});
export default router;
