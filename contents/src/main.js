import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/'
// markdown 效果
import './assets/css/md-vue.less'
import 'highlight.js/styles/vs.css'

// 你在本示例中要使用的组件库
// 这是我们添加一个本地开发中的库
// 使用库
// Vue.use(VC)

Vue.prototype.$axios = axios
Vue.prototype.$compile = Vue.compile

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
