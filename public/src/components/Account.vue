<template>
    <div class="container" style="padding-top:1vh">
        <md-dialog-confirm
      :md-active.sync="deleteAccount"
      md-title="Account löschen"
      md-content="Willst du deinen Account wirklich löschen? Um mit Nutzern in Kontakt zu treten musst du dich erneut registrieren."
      md-confirm-text="Account löschen"
      md-cancel-text="Abbrechen"
      @md-cancel="onCancel()"
      @md-confirm="onConfirm()" />
    <md-dialog :md-active.sync="addressGiven" id="address" class="dialog">
        <p class="error pink-text center-align"></p>
        <md-dialog-title>Bitte Adresse angeben:</md-dialog-title>
        Um die Tauschangebote auf der Karte lokalisieren zu können, benötigen wir deine Adresse. Diese ist nur für dich sichtbar und wird nur zur lokalisation verwendet.
        <input type="search" id="adress" placeholder="Wo wird getauscht?" />
                
        <md-dialog-actions>
            <md-button class="md-primary" @click="newOffering = false">Abbrechen</md-button>
            <md-button class="md-primary" @click="addOffering()">Speichern</md-button>
        </md-dialog-actions>
    </md-dialog>
<!--     <md-dialog :md-active.sync="showRevalidation" id="passwordDialog" class="dialog">
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
    </md-dialog> -->

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
        <input type="search" id="location" placeholder="Wo wird getauscht?" />
        <md-dialog-actions>
            <md-button class="md-primary" @click="newOffering = false">Abbrechen</md-button>
            <md-button class="md-primary" @click="addOffering()">Speichern</md-button>
        </md-dialog-actions>
    </md-dialog>


        <h1 style="display:inline;">Account</h1><div style="float:right;"><!-- <md-button class="md-accent" v-if="dataLoaded" @click="deleteAccount=true;">Profil löschen</md-button> --></div>
        <hr/>
        
        <div v-if="dataLoaded">
            <div style="height:2.5vh;"/>
            <table class="tableSize">
                <tr style="margin:5px"><td>Nutzername:</td><td>{{user.displayName}}</td></tr>
                <tr><td style="padding-bottom:2vh"/></tr>
                <tr><td>E-Mail:</td><td>{{user.email}}</td></tr>
                <tr><td style="padding-bottom:2vh"/></tr>
                <!-- <tr><td>Standort-Status:</td><td><md-icon v-if="hasLocation" style="color:mediumseagreen !important;">check_circle</md-icon><md-icon v-else style="color:indianred !important;">cancel</md-icon></td></tr> -->
<!--                 <tr><td colspan="2"><md-button class="md-default tableSize" @click="changePasswd=true">Passwort ändern</md-button></td></tr>
                <tr><td colspan="2"><md-button class="md-default tableSize" @click="changeProfile=true;">Profil bearbeiten</md-button> </td></tr> -->
                <!-- <tr><td colspan="2"><md-button class="md-default tableSize" @click="showLocation()">{{locationText}}</md-button> </td></tr>
                <tr v-if="isLocation"><td colspan="2"><input type="search" id="location" placeholder="Wo wird getauscht?" /></td></tr> -->
                
            </table>
            <div style="height:2.5vh;"/>
            <hr>
            <h1 style="display:inline;">Deine Tauschangebote:</h1><div style="float:right;"><md-button class="md-icon-button md-raised" @click="showLocation()"><md-icon>add</md-icon></md-button></div>
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
    </div>
</template>

<script>
import firebase from 'firebase'
import Axios from 'axios'
import store from '../store.js'
var places = require('places.js');
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
            },
            addressGiven:false,
            locationText:"Standort hinzufügen",
            hasLocation:false,
            isLocation:false
        }
    },
    mounted(){
        let vm=this;
        var _ = require('lodash');
        this.user= this.$store.state.user;
        this.$store.state.user==null ? this.dataLoaded=false:this.dataLoaded=true;
        this.getTrades();
        /* firebase.auth().onAuthStateChanged(function(user) {
            if(user){
                vm.user=user;
                vm.dataLoaded=true;
                console.log(document.getElementById('aligola'));
                
                vm.$store.commit("SET_USER",_.cloneDeep(user))
                Axios.post("/api/user", user);
                vm.getTrades();
            }else{
                vm.$modal.show();
            }
        }); */
    },
    methods:{
        async showLocation(){
            this.newOffering=true;
            var vm = this;
            var checkExist = setInterval(function() {
                if (document.getElementById('location') != null) {
                    var placesAutocomplete = places({
                    appId: process.env.VUE_APP_ALGOLIA_APPID,
                    apiKey: process.env.VUE_APP_ALGOLIA_KEY,
                    container: document.getElementById('location')
                    });
                    placesAutocomplete.on('change', function(event){
                        vm.location={
                            lng: event.suggestion.latlng.lng,
                            lat: event.suggestion.latlng.lat
                        }
                    });
                    clearInterval(checkExist);
                }
            }, 100);
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
            console.log(this.newTrade);
            if(this.location!=null) this.newTrade.location=this.location;
            let vm=this;
            console.log(this.newTrade);
            Axios.post("/api/offerings", this.newTrade).then(function(res){
                vm.newOffering=false;
                vm.newTrade.offer=null;
                vm.newTrade.tradeFor=null;
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
            Axios.post("/api/deleteTrade/"+this.user.uid,{tradeId:offer.tradeId, userId: offer.userId}).then(function(res){
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