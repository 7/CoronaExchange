<template>

  <div class="modal-wrapper" v-if="visible">
    
  <div v-if="login">
    <p class="closeModal h2 mb-2" v-on:click="hide()"><b-icon icon="x-square-fill"></b-icon></p>
    <section id="firebaseui-auth-container"></section>
    <div class="firebaseui-container firebaseui-page-provider-sign-in firebaseui-id-page-provider-sign-in firebaseui-use-spinner">
        <div class="firebaseui-card-content" style="text-align-last:center;">
    <button class="Signup firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-password firebaseui-id-idp-button" v-on:click="ToggleRegister()">Sign up</button></div>
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
  </div>

  
</template>


<script>
import firebase from "firebase";
import Modal from '../../modalPlugin.js'

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: ""
      },
      visible:false,
      error: null,
      login: true,
      register:false,
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
        let ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }
        var uiConfig = {
            signInSuccessUrl: "/",
            signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID]
        };
        ui.start("#firebaseui-auth-container", uiConfig);
  },
  methods: {
    ToggleRegister(){
      this.login=false;
      this.register=true;
    },
    submit() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.form.name
            })
            .then(() => {
              this.register=false;
              this.visible=false;
            });
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    show(params) {
      // making modal visible
      this.visible = true;
      // setting title and text
    },
    hide() {
      // method for closing modal
      this.visible = false;
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

