import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import axios from "axios";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;
// 设置语言
locale.use(lang);

import "./utils/element-ui";

// 全局注册
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
