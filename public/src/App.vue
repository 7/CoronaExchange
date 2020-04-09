<template>
  <div id="app" class="landing" style="min-height:100vh; background-color:#b8bfbb;">
    
    <Navigation class="frame" style="min-height:5vh"/>
    <notifications group="newMessage" />
    <router-view class="frame" style="min-height:95vh"></router-view>
    <login-modal/>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue"
import firebase from 'firebase'
import axios from 'axios'

export default {
  name: 'App',
  created (){
    document.title = "Corona Exchange";
  },
  components: {
    Navigation,
  },
  data(){
    return{
      alreadyMounted:false
    }
  },
  mounted(){
    let vm=this;
    firebase.auth().onAuthStateChanged(function(user) {
            if(user && !vm.alreadyMounted){
              vm.alreadyMounted=true;
        firebase.database().ref('/conversations').child(user.uid).on('child_changed',function(snapshot){
        let differentChat=[];
        differentChat = snapshot.val();
        axios.post("/api/notification", {convId: differentChat.convId, me: user.uid, participantId: differentChat.tradeWith}).then(function(response){
          if(response.data != false){
            vm.$notify({
              group: 'newMessage',
              title: 'Neue Nachricht!',
              text: 'Du hast eine neue Nachricht von '+response.data
            });
          }
        })
              

    })
            }else{
                vm.$modal.show();
            }
        });
    
  }
}
</script>

<style>
.frame{
  max-width:1200px;
  margin:auto;
  background-color: white;
  
}

</style>
