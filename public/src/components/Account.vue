<template>
    <div class="container" v-if="dataLoaded" style="padding-top:1vh">
        <md-dialog-confirm
      :md-active.sync="deleteAccount"
      md-title="Account löschen"
      md-content="Willst du deinen Account wirklich löschen? Um mit Nutzern in Kontakt zu treten musst du dich erneut registrieren."
      md-confirm-text="Account löschen"
      md-cancel-text="Abbrechen"
      @md-cancel="onCancel()"
      @md-confirm="onConfirm()" />

      <md-dialog :md-active.sync="showRevalidation" id="passwordDialog" class="dialog">
        <md-dialog-title>Bitte gib zur Bestätigung dein Passwort ein:</md-dialog-title>
        <p class="error pink-text center-align"></p>
            <md-field>
                <label>Passwort</label>
                <md-input v-model="password" type="password"></md-input>
            </md-field>
        <md-dialog-actions>
            <md-button class="md-primary" @click="showRevalidation = false">Abbrechen</md-button>
            <md-button class="md-primary" @click="onReauthenticate()">Speichern</md-button>
        </md-dialog-actions>
      </md-dialog>

      <md-dialog :md-active.sync="changePasswd" id="changePasswd" class="dialog">
        <p class="error pink-text center-align"></p>
        <md-dialog-title>Passwort ändern</md-dialog-title>
            <md-field>
                <label>Altes Passwort:</label>
                <md-input v-model="password" type="password"></md-input>
            </md-field>
            <md-field>
                <label>Neues Passwort:</label>
                <md-input v-model="newPasswd" type="password"></md-input>
            </md-field>
            <md-field>
                <label>Neues Passwort bestätigen:</label>
                <md-input v-model="newPasswdConf" type="password"></md-input>
            </md-field>
        
        <md-dialog-actions>
            <md-button class="md-primary" @click="changePasswd = false">Abbrechen</md-button>
            <md-button class="md-primary" @click="checkPasswd()">Speichern</md-button>
        </md-dialog-actions>
      </md-dialog>

      <md-dialog :md-active.sync="newOffering" id="newOffering" class="dialog">
        <p class="error pink-text center-align"></p>
        <md-dialog-title>Neues Tauschangebot anlegen</md-dialog-title>
            <md-field>
                <label>Was bietest du an?</label>
                <md-input v-model="newTrade.offer"></md-input>
            </md-field>
            <md-field>
                <label>Was möchtest du dafür haben? (Kann auch leer gelassen werden)</label>
                <md-input v-model="newTrade.tradeFor"></md-input>
            </md-field>
        
        <md-dialog-actions>
            <md-button class="md-primary" @click="newOffering = false">Abbrechen</md-button>
            <md-button class="md-primary" @click="addOffering()">Speichern</md-button>
        </md-dialog-actions>
      </md-dialog>


        <h1 style="display:inline;">Account</h1><div style="float:right;"><md-button class="md-accent" @click="deleteAccount=true;">Profil löschen</md-button></div>
        <hr/>
        Danke <p class="nameHighlight">{{user.displayName}}</p>, dass du unsere Idee unterstützt!
        <div style="height:2.5vh;"/>
        <table class="tableSize">
            <tr style="margin:5px"><td>Nutzername:</td><td>{{user.displayName}}</td></tr>
            <tr><td style="padding-bottom:2vh"/></tr>
            <tr><td>E-Mail:</td><td>{{user.email}}</td></tr>
            <tr><td colspan="2"><md-button class="md-default tableSize" @click="changePasswd=true">Passwort ändern</md-button></td></tr>
            <tr><td colspan="2"><md-button class="md-default tableSize" @click="changeProfile=true;">Profil bearbeiten</md-button> </td></tr>
        </table>
        <div style="height:2.5vh;"/>
        <hr>
        <h1 style="display:inline;">Deine Tauschangebote:</h1><div style="float:right;"><md-button class="md-icon-button md-raised" @click="newOffering=true;"><md-icon>add</md-icon></md-button></div>
        <hr>
        <div v-for="offer in offerings" :key="offer.tradeId" class="card">
            <p class="h2 mb-2" style="text-align:right;" @click="deleteOffer(offer)"><md-icon style="color: #c20000">delete</md-icon></p>
            <table style="width:100%;">
                <tr><td>Suche:</td><td>Biete:</td></tr>
                <tr><th>{{offer.tradeFor}}</th><th>{{offer.offer}}</th></tr>
            </table>
            <br><br>
            <table style="width:100%;">
                <tr><td><p style="font-size:0.75rem; color:darkgray;"> Eingestellt am {{getFormattedDate(offer.date)}}</p></td><td></td></tr>
            </table>
            
        </div>
        
    </div>
</template>

<script>
import firebase from 'firebase'
import Axios from 'axios'
import store from '../store.js'
export default {
    store,
    data(){
        return{
            user:null,
            dataLoaded:false,
            deleteAccount:false,
            showRevalidation:false,
            password:null,
            changeProfile:false,
            changePasswd:false,
            newPasswd:null,
            newPasswdConf:null,
            offerings:[],
            newTrade:{
                tradeId:null,
                userId:null,
                offer:null,
                location:{
                    lng: null,
                    lat:null
                },
                tradeFor:null,
                date:null
            },
            newOffering:false,
            location:{
                lng:null,
                lat:null
            }
        }
    },
    mounted(){
        let vm=this;
        var _ = require('lodash');
        firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                vm.user=user;
                vm.dataLoaded=true;
                
                vm.$store.commit("SET_USER",_.cloneDeep(user))
                Axios.post("/api/user", user);
                vm.getTrades();
            }else{
                vm.$modal.show();
            }
        });
        
        if(!("geolocation" in navigator)) {
      console.log("Geolocation is not available");
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      this.location.lng=pos.coords.longitude;
      this.location.lat=pos.coords.latitude;
    }, err => {
      console.log(err);
    })
    },
    methods:{
        saveToStore(user){
            
        },
        getFormattedDate(date){
            date=new Date(date);
            let s=date.getDate()+".";
            s+=date.getMonth()+1+".";
            s+=date.getFullYear();
            return s;
        },
        onConfirm(){
            let vm=this;
            firebase.auth().currentUser.delete().then(function(){
                vm.$router.push("/");
            }).catch(function(error){
                if(error.code=="auth/requires-recent-login") vm.showRevalidation=true;
            });
        },
        onCancel(){
            this.deleteAccount = false;
        },
        onReauthenticate(){
            let vm=this;
            firebase.auth().signInWithEmailAndPassword(this.user.email, this.password).then((user)=>{
            vm.showRevalidation=false;
            vm.deleteAccount=true;
            passwordDialog.querySelector('.error').innerHTML = '';
            changePasswd.querySelector('.error').innerHTML='';
        }).catch((error)=>{
            passwordDialog.querySelector('.error').innerHTML = error.message;
        });
        firebase.auth().currentUser.delete().then(function(){
                vm.$router.push("/");
            }).catch(function(error){
                if(error.code=="auth/requires-recent-login") vm.showRevalidation=true;
            });
        },
        checkPasswd(){
            let vm=this;
            if(this.newPasswd==this.newPasswdConf){
                firebase.auth().signInWithEmailAndPassword(this.user.email, this.password).then((user)=>{
                    firebase.auth().currentUser.updatePassword(this.newPasswd).then((user)=>{}).catch((error)=> {
                        changePasswd.querySelector('.error').innerHTML=error.message;
                    });
                    changePasswd.querySelector('.error').innerHTML='';
                    vm.changePasswd=false;
                    vm.newPasswd=vm.newPasswdConf=vm.password=null;
                }).catch((error)=>{
                changePasswd.querySelector('.error').innerHTML = error.message;
            });
            }else{
                changePasswd.querySelector('.error').innerHTML= "New passwords don't match";
            }
        },
        addOffering(){
            this.newTrade.userId = this.user.uid;
            if(this.location!=null) this.newTrade.location=this.location;
            let vm=this;
            Axios.post("/api/offerings/"+this.newTrade.userId, this.newTrade).then(function(res){
                console.log(res);
                vm.newOffering=false;
                vm.newTrade.offer=null;
                vm.newTrade.tradeFor=null;
                console.log(res.data);
                vm.offerings.push(res.data);
            }).catch(error=>console.log(error));
        },
        getTrades(){
            let vm=this;
            Axios.get("/api/trades/"+this.user.uid).then(function(res){
               res.data.forEach(element => {
                   vm.offerings.push(element);
               });
            }).catch((error)=>console.log(error));
        },
        deleteOffer(offer){
            let vm=this;
            Axios.post("/api/deleteTrade/"+this.user.uid,offer).then(function(res){
                vm.offerings=[];
                res.data.forEach(element => {
                   vm.offerings.push(element);
               });
            }).catch((error)=>console.log(error));
        }
    }
}
</script>
<style scoped>
.nameHighlight{
    color: var(--primaryColor);
    display:inline;
    font-weight: 600;
}
.md-accent{
    color: var(--alertDark) !important;
    border: 1px solid;
}
.container{
    font-size: 1.2rem;
}
.md-default{
    margin:0;
    margin-top:2vh;
    border: 1px solid;
    background-color: var(--accentLight);
}
.tableSize{
    width:70vw;
    max-width: 400px;
}
.dialog{
    width:50vw;
    padding: 0 2vw;
    height:50vh;
    max-height:500px;
}
.card{
    width:50vw;
    max-width: 250px;
    display:inline-block;
    margin:1vw;
    padding:0 1vw;
}
</style>