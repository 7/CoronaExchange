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
axios.defaults.baseURL="http://localhost:5000";
/* Import Components for Router */
import RegisterComponent from './components/Authentication/Register.vue'
import LandingComponent from './components/LandingPage.vue'
import ChatComponent from './components/Chat.vue'
import AccountComponent from './components/Account.vue'
import ChatOverviewComponent from './components/ChatOverview.vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

Vue.config.productionTip = false
const firebaseConfig = {     
  apiKey: process.env.VUE_APP_API_KEY,     
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,     
  databaseURL: process.env.VUE_APP_DATABASE_URL,     
  projectId: process.env.VUE_APP_PROJECT_ID,           
  appId: process.env.VUE_APP_APP_ID   };   // Initialize Firebase   firebase.initializeApp(firebaseConfig);

  
  firebase.initializeApp(firebaseConfig);

import Notifications from 'vue-notification'

Vue.use(Notifications);

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
  {path: '/ChatOverview', component: ChatOverviewComponent, meta: {requiresAuth:true, requiresConversations:true}},
  {path:'/Account', component: AccountComponent, meta: {requiresAuth:true}},
  {path: '/Chat', component: ChatComponent, meta: {requiresAuth:true}}

  ]
  })
  router.beforeEach((to, from, next) => {
    if ( to.matched.some(record => record.meta.requiresAuth)) {      
      var _ = require('lodash');
      firebase.auth().onAuthStateChanged(function(user) {
        if(user){
          axios.post("/api/user", {uid:user.uid, displayName:user.displayName, email:user.email}).then(
            ()=>{
              axios.get('/api/user/'+user.uid).then((res)=>{
                store.commit("SET_USER",_.cloneDeep(res.data))});
                if(store.state.conversations == null){
                  let chats=[]
                  axios.get("/api/conversations/"+user.uid).then(function(res){
                     res.data.forEach(element => {
                         chats.push(element);
                     });
                     store.commit("SET_CONVERSATIONS",chats);
                     if ( to.matched.some(record => record.meta.requiresConversations)) {
                      let chats=[]
                      axios.get("/api/conversations/"+store.state.user.uid).then(function(res){
                         res.data.forEach(element => {
                             chats.push(element);
                         });
                         store.commit("SET_CONVERSATIONS",chats);
                      }).catch((error)=>console.log(error));
                    }
                  }).catch((error)=>console.log(error));
                }
                  next();
            }
          );
          
        }else{
          parent.$modal.show();
        }
    });
    } else {
        next();
    }
});
var parent = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
