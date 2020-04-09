<template>
  <div  class="container" id="app" style="background-color:white; padding-top:1vh;">
    <div class="alertBox" @click="showInfo=true"><div style="display:inline-block; color: white; margin-top:15px; margin-left:25px;">Bitte beachte die Verhaltensregeln im Bezug auf Corona bei der Übergabe der Ware!</div><md-icon style="height:50px; width:50px; float:right; color:white;">info</md-icon></div>
      <md-dialog :md-active.sync="showInfo">
      <md-dialog-title>Verhaltensregeln</md-dialog-title>
      <div style="margin:2.5vw; font-size: 1.2rem;">1. Der Warentausch sollte kontaktlos erfolgen<br><br>
      2. Sollte es zu Kontakt gekommen sein, waschen Sie sich anschließend gründlich die Hände (mindestens 20 Sekunden mit Seife)<br><br>
      3. Beachten Sie den Mindestabstand von 1,5 Metern<br><br>
      4. Führen Sie keinen Tausch durch, wenn Sie Symptome aufweisen oder sich in Quarantäne befinden</div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showInfo = false">Verstanden</md-button>
      </md-dialog-actions>
      </md-dialog>
      <div class="chatcontainer">
      <div v-for="message in messages" v-bind:key="message.message">
        <div v-if="message.from==me" class="msg right-msg">
      <div
       class="msg-img"
       style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)"
      ></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">Du</div>
          <div class="msg-info-time">{{getFormattedTime(message.date)}}</div>
        </div>

        <div class="msg-text">
          {{message.message}}
        </div>
      </div>
    </div>

    <div v-else class="msg left-msg">
      <div
       class="msg-img"
       style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"
      ></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">{{message.traderName}}</div>
          <div class="msg-info-time">{{getFormattedTime(message.date)}}</div>
        </div>

        <div class="msg-text">
          {{message.message}}
        </div>
      </div>
    </div>
    </div>
    </div>
     <div class="messageBox"><md-field>
      <md-input v-model="message"></md-input><md-button class="md-icon-button md-dense md-primary" @click="sendMessage()"><md-icon>send</md-icon></md-button>
    </md-field></div>
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
          messages:[],
          messagesLoaded:false,
          message:"",
          showInfo:false
      }
  },
  methods:{
      getFormattedTime(date){
        date = new Date(date);
        let time = ('0'+date.getHours()).slice(-2)+ ':'+('0'+date.getMinutes()).slice(-2);
        /* let time = date.getHours();
        time +=":"+date.getMinutes(); */
        return time;
      },
      getFormattedDate(date){
            date=new Date(date);
            let s=date.getDate()+".";
            s+=date.getMonth()+1+".";
            s+=date.getFullYear();
            return s;
        },
      getMessages(){
          let vm=this;

          axios.get("/api/chat/"+this.$route.query.convId).then(function(res){
               if(!vm.messagesLoaded) vm.messagesLoaded=true;
               vm.messages=[];
               res.data.forEach(element => {
                  vm.messages.push(element); 
               });
               
               let objDiv = document.getElementsByClassName('chatcontainer')[0];
            }).catch((error)=>console.log(error));
      },
      sendMessage(){
          let msg={
              message: this.message,
              from: this.$store.state.me,
              to: this.$store.state.participant,
              convId: this.$route.query.convId,
              dateSent:Date.now()
            }
            this.messages.push(msg);
            let vm=this;
            axios.post("/api/chat", msg).then((response)=>{
                //vm.messagesLoaded=false;
                
            }).catch((error)=>console.log(error));
      }
  },
  
  mounted(){
    
      var _ = require('lodash');
      let vm=this;
      firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                vm.$store.commit("SET_USER",_.cloneDeep(user))
                axios.post("/api/user", user);
                vm.me=user.uid;
                vm.$store.state.me=user.uid;
                vm.getMessages();
                firebase.database().ref('/messages').child(vm.$route.query.convId).on('value',function(snapshot){
                  vm.getMessages();
                });
            }else{
                vm.$modal.show();
            }
        }); 
    
  }
}
</script>

<style>
.alertBox{
  height:50px;
  background-color:#c20000;
  border-radius:15px;
}

.chatcontainer{
    overflow-y:scroll;
    height: calc(100vh - 200px);
    vertical-align: bottom;
    display: block;
    margin-top:10px;
}


.messageBox{
    border: 1px solid;
    border-radius: 25px;
    position:fixed;
    bottom: 2.5vh;
    height: 40px;
    width:82.5vw;
    background-color:white;
}

:root {
  --body-bg: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  --msger-bg: #fff;
  --border: 2px solid #ddd;
  --left-msg-bg: #b8bfbb;
  --right-msg-bg: #668659;
}

.msg-bubble {
  max-width: 450px;
  padding: 15px;
  border-radius: 15px;
  background: var(--left-msg-bg);
}
.msg-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.msg-info-name {
  margin-right: 10px;
  font-weight: bold;
}
.msg-info-time {
  font-size: 0.85em;
}

.left-msg .msg-bubble {
  border-bottom-left-radius: 0;
  margin-right:auto;
  margin-left:1vw;
  margin-top:0.5vh;
  margin-bottom:0.5vh;
}

.right-msg {
  flex-direction: row-reverse;
}
.right-msg .msg-bubble {
  background: var(--right-msg-bg);
  color: #fff;
  border-bottom-right-radius: 0;
  margin-left:auto;
  margin-right:1vw;
  margin-top:0.5vh;
  margin-bottom:0.5vh;
}
.right-msg .msg-img {
  margin: 0 0 0 10px;
}
</style>
<style scoped>
.md-field{
    padding-top:0 !important;
    min-height:25px !important;
    position: inherit !important;
    margin: 4px 10px 5px !important;
    width: 80% !important;
}
.container{
    font-size:1.2rem;
}
</style>