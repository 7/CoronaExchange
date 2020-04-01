import "bootstrap"
import "./assets/scss/main.scss"
import Vue from 'vue'
import App from './App.vue'
import * as firebase from "firebase"
import VueRouter from 'vue-router'
import 'leaflet/dist/leaflet.css';

import VueGlobalVariable from 'vue-global-var'
import Modal from 'vue-js-modal'
import "firebaseui/dist/firebaseui.css";
import ModalPlugin from './modalPlugin.js'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import axios from 'axios'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import VueMaterial from 'vue-material'
import store from './store.js'
require('dotenv').config();

Vue.use(VueMaterial);

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
import LandingComponent from './components/LandingPage.vue'
import ChatComponent from './components/Chat.vue'
import AccountComponent from './components/Account.vue'

Vue.config.productionTip = false

const firebaseConfig = {     
  apiKey: process.env.VUE_APP_APIKEY,     
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,     
  databaseURL: process.env.VUE_APP_DATABASE_URL,     
  projectId: process.env.VUE_APP_PROJECT_ID,        
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,     
  appId: process.env.VUE_APP_APP_ID   };   // Initialize Firebase   firebase.initializeApp(firebaseConfig);

  firebase.initializeApp(firebaseConfig);

import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const router = new VueRouter({
  routes: [
    { path: '/', component: LandingComponent},
  { path: '/register', component: RegisterComponent },
  {path: '/Chat', component: ChatComponent},
  {path:'/Account', component: AccountComponent}

  ]
  })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
