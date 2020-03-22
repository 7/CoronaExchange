import "bootstrap"
import "./assets/scss/main.scss"
import Vue from 'vue'
import App from './App.vue'
import * as firebase from "firebase"
import VueRouter from 'vue-router'
import VueGlobalVariable from 'vue-global-var'
import Modal from 'vue-js-modal'
import * as firebaseui from 'firebaseui'
import "firebaseui/dist/firebaseui.css";
import ModalPlugin from './modalPlugin.js'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.use(ModalPlugin)

Vue.use(VueGlobalVariable, {
  globals:{
    showModal:false
  }
})
Vue.use(VueRouter)

/* Import Components for Router */
import RegisterComponent from './components/Authentication/Register.vue'
import LoginComponent from './components/Authentication/Login.vue'
import LandingComponent from './components/LandingPage.vue'
import ChatComponent from './components/Chat.vue'

Vue.config.productionTip = false

const firebaseConfig = {     
  apiKey: "AIzaSyA8Cnt81CF00BWGof4H-jEr-n0GjDisfDQ",     
  authDomain: "coronaexchange-44512.firebaseapp.com",     
  databaseURL: "https://coronaexchange-44512.firebaseio.com/",     
  projectId: "coronaexchange-44512",     
  storageBucket: "coronaexchange-44512.appspot.com",     
  messagingSenderId: "468202509714",     
  appId: "1:468202509714:web:0605968eec17c13b1f9d4b"   };   // Initialize Firebase   firebase.initializeApp(firebaseConfig);

  firebase.initializeApp(firebaseConfig);


const router = new VueRouter({
  routes: [
    { path: '/', component: LandingComponent},
  { path: '/login', component: LoginComponent },
  { path: '/register', component: RegisterComponent },
  {path: '/Chat', component: ChatComponent}

  ]
  })

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
