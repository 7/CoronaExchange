import $ from "jquery"
import "bootstrap"
import "./assets/scss/main.scss"
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
