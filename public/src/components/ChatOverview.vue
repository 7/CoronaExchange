<template>
  <div  class="container" id="app" style="background-color:white;" v-if="chatsLoaded">
      <h1 style="display:inline;">Chats</h1>
      <hr>
      <p v-if="chats.length == 0">Noch keine Chats vorhanden? Du kannst Kontakt zu anderen Nutzern über die "Produkt finden" Seite aufnehmen. <br><br>
      Wenn die ein Angebot gefällt und du tauschen möchtest klicke einfach auf Kontaktieren und schon füllt sich diese Seite.</p>
      <div v-for="chat in chats" :key="chat.id" @click="viewChat(chat.tradeWith)">
          <md-toolbar >
                <div style="width:100%;">Du bietest {{chat.offer}}<md-icon>swap_horiz</md-icon>{{chat.traderName}} bietet {{chat.tradeFor}}
                <div style="display:inline; float:right; font-size:0.75rem; color:darkgray;"> Letzte Nachricht: {{getFormattedDate(chat.lastMessage)}}</div>
              </div>
          </md-toolbar>
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
    hashCode(string) {
        var hash = 0;
        if (string.length == 0) {
            return hash;
        }
        for (var i = 0; i < string.length; i++) {
            var char = string.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
        },
      viewChat(id){
          this.$store.state.me=this.me;
          this.$store.commit("SET_PARTICIPANT", id);
          this.$router.push({path:'/Chat', query:{convId:Math.abs(this.hashCode(this.me)+this.hashCode(id))}});
      },
      getFormattedDate(date){
            date=new Date(date);
            let s=date.getDate()+".";
            s+=date.getMonth()+1+".";
            s+=date.getFullYear();
            return s;
        },
      getChats(){
          let vm=this;
          axios.get("http://localhost:5000/api/conversations/"+this.me).then(function(res){
               res.data.forEach(element => {
                   vm.chats.push(element);
                   
               });
               vm.chatsLoaded=true;
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
.md-toolbar{
    display:flex !important;
    padding: 10px 16px !important;
}
.p{
    margin:0 0 !important;
}
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
