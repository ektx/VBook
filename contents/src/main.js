import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/'
import enhance from '../enhance.js'

Vue.prototype.$axios = axios
Vue.prototype.$compile = Vue.compile

Vue.config.productionTip = false

enhance({Vue})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
