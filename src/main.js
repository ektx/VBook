import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/'
// 你在本示例中要使用的组件库
// 这是我们添加一个本地开发中的库
import VC from '@ektx/vc'
import '@ektx/vc/dist/vc.css'

Vue.prototype.$axios = axios
Vue.prototype.$compile = Vue.compile

Vue.config.productionTip = false
// 使用库
Vue.use(VC)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
