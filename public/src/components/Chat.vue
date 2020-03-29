<template>
  <div  class="container" id="app" style="background-color:white;" v-if="chatsLoaded">
      <h1 style="display:inline;">Chats</h1>
      <hr>
      <p v-if="chats.length == 0">Noch keine Chats vorhanden? Du kannst Kontakt zu anderen Nutzern über die "Produkt finden" Seite aufnehmen. <br><br>
      Wenn die ein Angebot gefällt und du tauschen möchtest klicke einfach auf Kontaktieren und schon füllt sich diese Seite.</p>
      <div v-for="chat in chats" :key="chat.id">
          <p>Chat mit {{chat.tradeWith}}</p>
          <p>Ihr tauscht {{chat.offer}} für {{chat.tradeFor}}</p>
      </div>
        <!-- <div v-for="message in messages" v-bind:key="message.id">
            <div v-if="message.id==0" class="box1 sb1">{{message.message}}</div>
            <div v-if="message.id==1" class="box2 sb2">{{message.message}}</div>
        </div> -->
    
    
  </div>
</template>

<script>
import axios from 'axios'
import store from'../store.js';
import firebase from 'firebase';
export default {
    store,
  name: 'App',
  data(){
      return{
          me:null,
          participant:null,
          chats:[],
          chatsLoaded:false
      }
  },
  methods:{
      getChats(){
          let vm=this;
          console.log(this.me);
          axios.get("http://localhost:5000/api/conversations/"+this.me).then(function(res){
               res.data.forEach(element => {
                   console.log(element);
                   vm.chats.push(element);
                   
               });
               vm.chatsLoaded=true;
               console.log(vm.chats);
            }).catch((error)=>console.log(error));
      }
  },
  
  mounted(){
      var _ = require('lodash');
      let vm=this;
      firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                vm.$store.commit("SET_USER",_.cloneDeep(user))
                axios.post("http://localhost:5000/api/user", user);
                vm.me=user.uid;
                console.log(vm.me);
                vm.getChats();
            }else{
                vm.$modal.show();
            }
        });
    
  }
}
</script>

<style>
.container{
    font-size:1.2rem;
}
.box1 {
  width: 60vw;
  margin: 25px auto;
  background: #668659;
  padding: 5px;
  text-align: center;
  font-weight: 500;
  color: #fff;
  font-family: arial;
  position:relative;
}
.box2 {
  width: 60vw;
  margin: 25px auto;
  background: #b8bfbb;
  padding: 5px;
  text-align: center;
  font-weight: 500;
  color: #fff;
  font-family: arial;
  position:relative;
}
.sb1:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid #668659;
  border-right: 10px solid transparent;
  border-top: 10px solid #668659;
  border-bottom: 10px solid transparent;
  right: -20px;
  top: 6px;
}
.sb2:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid transparent;
  border-right: 10px solid #b8bfbb;
  border-top: 10px solid #b8bfbb;
  border-bottom: 10px solid transparent;
  left: -19px;
  top: 6px;
}
</style>
