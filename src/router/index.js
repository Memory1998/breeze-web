import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

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
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
