import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import api from './api'

Vue.use(ElementUI);
Vue.prototype.$http = api

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
