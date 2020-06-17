<template>

  <div class="modal-wrapper" v-if="visible">
    
  <div v-if="loginMethods">
    <p class="closeModal h2 mb-2" v-on:click="hide()"><b-icon icon="x-square-fill"></b-icon></p>

    <div class="firebaseui-card-content" style="text-align-last:center;">
      <button style="margin-top:0" class="Signup firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-password firebaseui-id-idp-button" v-on:click="ToggleLogin()">Login</button><br>
      <button class="Signup firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-password firebaseui-id-idp-button" v-on:click="googleLogin()">Login with Google</button><br><br><br>
      <button class="Signup firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-password firebaseui-id-idp-button" v-on:click="ToggleRegister()">Sign up</button>
    </div>
  </div>
  
        <div v-if="register">
          <div class="card-header" style="display:flex; justify-content: space-between; padding: 2.5px; background-color:#33443c; color: white;">
            <p style="margin-top: auto; margin-left:1vw; font-weight:600;">Registrieren</p>
            <p class="closeModal h2 mb-2" v-on:click="hide()"><b-icon icon="x-square-fill"></b-icon></p>
          </div>
          
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <form action="#" @submit.prevent="submit">
              <div class="form-group row">
                <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>

                <div class="col-md-6">
                  <input
                    id="name"
                    type="name"
                    class="form-control"
                    name="name"
                    value
                    required
                    autofocus
                    v-model="form.name"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="form.email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

                <div class="col-md-6">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="form.password"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Register</button>
                </div>
              </div>
            </form>
          </div>
  </div>
  <div v-if="login">
          <div class="card-header" style="display:flex; justify-content: space-between; padding: 2.5px; background-color:#33443c; color: white;">
            <p style="margin-top: auto; margin-left:1vw; font-weight:600;">Einloggen</p>
            <p class="closeModal h2 mb-2" v-on:click="hide()"><b-icon icon="x-square-fill"></b-icon></p>
          </div>
          
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{error}}</div>
            <form action="#" @submit.prevent="submit">

              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    value
                    required
                    autofocus
                    v-model="form.email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

                <div class="col-md-6">
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="form.password"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Login</button>
                </div>
              </div>
            </form>
          </div>
  </div>

</div>

  
</template>


<script>
import firebase from "firebase";
import firebaseui from 'firebaseui';
import Modal from '../../modalPlugin.js'
import "firebaseui/dist/firebaseui.css";
import store from '../../store';
import axios from 'axios';

export default {
  store,
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: ""
      },
      visible:false,
      error: null,
      login: false,
      register:false,
      loginMethods: true,
      ui:null
    };
  },
  beforeMount() {
    // here we need to listen for emited events
    // we declared those events inside our plugin
    Modal.EventBus.$on('show', (params) => {
      this.show(params)
    })
  },
  mounted() {
    
  },
  methods: {
    ToggleRegister(){
      this.login=false;
      this.loginMethods=false;
      this.register=true;
    },
    ToggleLogin(){
      this.loginMethods=false;
      this.register=false;
      this.login=true;
    },
    googleLogin(){
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result)=>{
        vm.saveUser(result.user);
        this.hide();
      }).catch((err)=>{
        alert("Something went wrong");
      });
    },
    submit() {
      var vm = this;
      if(this.register){
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          vm.saveUser(data.user);
          data.user
            .updateProfile({
              displayName: this.form.name
            })
            .then((user) => {
              this.register=false;
              this.login=false;
              this.visible=false;
            });
        })
        .catch(err => {
          this.error = err.message;
        });
      }else if(this.login){
        firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password).then((data)=>{
          vm.saveUser(data.user);
          this.hide();
        });
      }
    },
    show(params) {
      // making modal visible
      this.visible = true;
      this.loginMethods=true;
    },
    saveUser(user){
      axios.post("/api/user", {uid:user.uid, displayName:user.displayName, email:user.email}).then(
        ()=>{
          axios.get('/api/user/'+user.uid).then((res)=>{
            store.commit("SET_USER",res.data)});
        }
      );
    },
    hide() {
      // method for closing modal
      this.visible = false;
      this.loginMethods=false;
      this.login=false;
      this.register=false;
    },
    confirm() {
      // confirm code will be here soon(TM)
    }
  }
}
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40vw;
  height: 30vh;
  z-index: 1000;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background-color:#b7bfbb;
}
.Signup {
  margin-top:5%;
  color: white;
  background-color: #33443c;

}
.closeModal{
  text-align:right;
}
.svg{
  vertical-align: unset !important;
}
</style>

