import Vue from 'vue'
import App from './App.vue'
// import store from './store'

import { createRouter } from './router'
import { createStore } from '@/store'

Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: (h) => h(App),
// }).$mount('#app')

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    // 根实例简单的渲染应用程序组件。
    render: (h) => h(App),
  })
  return { app, router }
}