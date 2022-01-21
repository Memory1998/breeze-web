import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";

// 设置语言
locale.use(lang);
import "./utils/element-ui";

import axios from "axios";

// 全局注册
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
