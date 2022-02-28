import Vue from "vue";
import VueRouter from "vue-router";
import Element from "element-ui";
import { menuTree } from "@/api/menu";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  // {
  //   path: "/index",
  //   name: "Index",
  //   component: () => import("@/views/index.vue"),
  //   children: [],
  // },
  //     {
  //       path: "/user",
  //       name: "User",
  //       component: () => import("../views/admin/user"),
  //     },
  //     {
  //       path: "/platform",
  //       name: "Platform",
  //       component: () => import("../views/admin/platform"),
  //     },
  //     {
  //       path: "/menu",
  //       name: "Menu",
  //       component: () => import("../views/admin/menu"),
  //     },
  //   ],
  // },
];

const router = new VueRouter({
  routes,
});

export const initMenu = (routers) => {
  menuTree().then((response) => {
    if (!response.data) {
      return;
    }
    // let formatRouters = formatRouter(routers, response.data);
    // debugger;
    // if (formatRouters.length > 0) {
    //   // eslint-disable-next-line no-unused-vars
    //   let temp = {};
    //   formatRouters.forEach((x) => {
    //     let flag = x.parentId === 0;
    //     console.log(x);
    //     if (flag) {
    //       router.options.routes.push(x);
    //     }
    //   });
    //   console.log(router);
    // }
    console.log(routers);
    response.data.forEach((menu) => {
      debugger;
      routers.addRoute({
        path: "/" + menu.url,
        meta: { name: menu.name, isAsync: true, icon: menu.icon },
        name: menu.name,
        component: () => import(`../views/${menu.path}`),
      });
    });
    console.log(router.getRoutes());
  });
};

export const formatRouter = (routers, data) => {
  let routerResult = [];
  data.forEach((router) => {
    let { name, icon, route_path, url_path, children, parentId } = router;
    if (children && children instanceof Array) {
      children = formatRouter(routers, children);
    }
    let formatRouters = {
      path: "/" + url_path,
      name: name,
      icon: icon,
      children: children,
      parentId: parentId,
      component: (resolve) => {
        if (route_path === "/index") {
          require(["@/views/" + route_path], resolve);
        } else {
          require(["@/views" + route_path], resolve);
        }
      },
    };
    console.log("routers");
    console.log(routers);
    console.log(route_path);
    routerResult.push(formatRouters);
  });
  console.log(routerResult);
  return routerResult;
};

router.beforeEach((to, from, next) => {
  let access_token = localStorage.getItem("access_token");
  if (access_token) {
    next();
  } else {
    if (to.path === "/") {
      next();
    } else {
      next("/");
      Element.Message.error("您还没有登录，请先登录");
    }
  }
});
initMenu(router);

export default router;
