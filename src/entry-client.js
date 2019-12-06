import { createApp } from "./app";
import * as tf from "@tensorflow/tfjs"; // 增加js文件大小用于观察优化效果
import three from "three";
import moment from "moment";
// 客户端特定引导逻辑……

const { app, router, store } = createApp();
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}
router.onReady(() => {
  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  app.$mount("#app");
});
