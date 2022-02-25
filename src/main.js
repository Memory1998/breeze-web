import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import "./utils/element-ui";

Vue.config.productionTip = false;

// 设置语言
locale.use(lang);

// 全局注册
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
