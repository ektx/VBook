import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/'
import bridge from './bridge'

Vue.prototype.$axios = axios
Vue.prototype.$compile = Vue.compile

Vue.config.productionTip = false

bridge({Vue})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
