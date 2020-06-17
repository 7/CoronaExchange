<template>
  <div id="app" class="landing">

    <input type="search" id="address-input" placeholder="Wo möchtest du suchen?" />
    <MapView v-bind:items="filteredItems" v-on:contactUser="contactUser"></MapView>

    <!-- <div class="jumbotron">
      <div class="container">
        <ItemSearch  v-bind:searchFilter="filterKeywords.searchFilter" v-bind:offeringsFilter="filterKeywords.offeringsFilter" v-on:filterBySearch="filterBySearch" v-on:filterByOffer="filterByOffer" />
      </div>
    </div> -->

    <div class="container">
      <ItemList v-bind:items="filteredItems" v-on:contactUser="contactUser" />
    </div>
    <div class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tauschpartnerchat</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <textarea name="" id="modal-text" class="form-control" rows="4" v-model="message"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Abbrechen</button>
            <button type="button" class="btn btn-primary" style="background-color: #668659;" @click="newConversation()">Nachricht senden</button>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import Navigation from "./Navigation.vue"
import ItemSearch from "./ItemSearch"
import ItemList from "./ItemList"
import { computeDestinationPoint } from "geolib"
import $ from "jquery"
import MapView from "./MapView";
import axios from 'axios';
import firebase from 'firebase';
import store from'../store.js';
var places = require('places.js');
const geofire = require('geofire');

export default {
  name: 'LandingPage',
  store,
  components: {
    Navigation,
    ItemSearch,
    ItemList,
    MapView
  },
  data: function() {
    return {
      selectedUser: {
        _id: null,
        name: ""
      },
      user_location: null,
      perimeter_rectangle: null,
      filter_offer_by: "",
      filter_search_by: "",
      items: [],
      message:"",
      geoQuery:null
    }
  },
  computed: {
    filteredItems: function() {
      var items = this.items;
      var vm = this;

      if (vm.filter_search_by !== "" && vm.filter_search_by !== "Alles") {
        console.log("Filter search by " + this.filter_search_by);
        items = items.filter(function(item) { return item.offer === vm.filter_search_by; });
      }

      if (vm.filter_offer_by !== "" && vm.filter_offer_by !== "Alles") {
        console.log("Filter offer by " + this.filter_offer_by);
        items = items.filter(function(item) { return item.tradeFor === vm.filter_offer_by; });
      }

      return items;
    },

    filterKeywords: function() {
      var searchFilter = [];
      var offeringsFilter = [];

      this.items.map(function(item) {
        if (searchFilter.indexOf(item.offer) === -1) {
          searchFilter.push(item.offer);
        }
        if (offeringsFilter.indexOf(item.tradeFor) === -1) {
          offeringsFilter.push(item.tradeFor);
        }
      });

      return {
        searchFilter: searchFilter,
        offeringsFilter: offeringsFilter
      };
    }
  },
  methods: {
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
    newConversation(){
      var _ = require('lodash');
      let vm=this;
      firebase.auth().onAuthStateChanged(function(user) {
            if(!user){
                vm.$modal.show();
            }else{
              let conversation={
                me: user.uid,
                offer: vm.selectedUser.offer,
                tradeFor: vm.selectedUser.tradeFor,
                tradeId: vm.selectedUser.tradeId,
                tradeWith: vm.selectedUser.userId,
                convId: Math.abs(vm.hashCode(vm.selectedUser.userId)+vm.hashCode(user.uid))
              }
              axios.post("/api/conversations", conversation).then(function(res){
                   let msg={
              message: vm.message,
              from: user.uid,
              to: conversation.tradeWith,
              convId: conversation.convId,
              dateSent:Date.now()
            }
            axios.post("/api/chat", msg).then((response)=>{
              $(".modal").modal('toggle');}).catch((error)=>console.log(error));
            
            });
            }
        }); 
    },
    contactUser: function(user) {
      if(user.userId == this.$store.state.user.uid) {
        alert("Du kannst dich nicht selbst kontaktieren!");
      }else{
      this.selectedUser = user;
      this.message="Hallo, ich würde gerne "+ this.selectedUser.tradeFor+" gegen "+ this.selectedUser.offer+" tauschen. Wollen wir dazu einen Treffpunkt vereinbaren?";
      $(".modal").modal();
      $("#modal-text").focus();
      }
      
    },
    sendMessage: function() {
      if (!this.contactUser) {
        console.error("Missing user id");
        return;
      }
    },
    initialLocation(geoRef){
      this.user_location={
        lat: 47.814193,
        lng: 9.653198
      }
      var vm = this;
      this.$store.commit('SET_LOCATION', this.user_location);
    this.geoQuery = geoRef.query({center: [47.814193, 9.653198], radius:15});
    firebase.database().ref('/trades').once('value').then(function(elems){
    vm.geoQuery.on("key_entered", function(key, location) {
    elems.forEach(elem => elem.forEach(child=>child.key==key && vm.items.push(child.val())));
  });
  });
    }

    /* filterBySearch: function(keyword) {
      this.filter_search_by = keyword;
    },

    filterByOffer: function(keyword) {
      this.filter_offer_by = keyword;
    },

    getUserLocation: function(callback) {

        callback("88214");
    },

    getPerimeterRectangle: function(location) {
      var topLeftLocation = {
        latitude: location.lat - 20,
        longitude: location.long - 20
      }

      var bottomRightLocation = {
        latitude: Number(location.lat) + 20,
        longitude: Number(location.long) + 20
      };

      return {
        topLeftLocation: topLeftLocation,
        bottomRightLocation: bottomRightLocation
      };
    },

    fetchItemList: function(perimeter_rectangle) {
      console.log("Fetch item list...");
      var vm = this;
      
      // var url = `/api/search?topLeftLocation=${perimeter_rectangle.topLeftLocation.latitude},${perimeter_rectangle.topLeftLocation.longitude}&lowerRightLocation=${perimeter_rectangle.bottomRightLocation.latitude},${perimeter_rectangle.bottomRightLocation.longitude}`;
      var url = "http://localhost:5000/api/search?topLeftLocation=52.40,13.40&lowerRightLocation=47.814193,9.653198";
      $.getJSON(url).done(function(data) {
        console.log("Fetched item data");
        vm.items = data;
      }).fail(function(err) {
        console.log(err);
      });
    } */
  },
  /* created: function() {
    var vm = this;
    
    console.log("Retrieve user location...");
    this.getUserLocation(function(location) {
      console.log(location);
      vm.user_location = location;
      var rectangle = vm.getPerimeterRectangle(location);
      vm.fetchItemList(rectangle);
    })
    
  }, */
  mounted:function(){
    var geoRef = new geofire.GeoFire(firebase.database().ref('/tradeLocations'));
    var placesAutocomplete = places({
  appId: "pl680V9MNINR",
  apiKey: process.env.VUE_APP_ALIGOLA_KEY,
  container: document.querySelector('#address-input')
});
var vm=this;
this.initialLocation(geoRef);
placesAutocomplete.on('change', function(event){
  vm.$store.commit('SET_LOCATION',event.suggestion.latlng);
  vm.geoQuery = geoRef.query({center: [event.suggestion.latlng.lat,event.suggestion.latlng.lng], radius:15});
  /* firebase.database().ref('/trades').once('value').then(function(elems){
    console.log(elems);
  vm.geoQuery.on("key_entered", function(key, location) {
    console.log(key)
    elems.forEach(elem => elem.forEach(child=>child.key==key && vm.items.push(child)));
  });
  }); */
  vm.geoQuery.on("key_entered", function(key, location, distance) {
    vm.items=[];
    firebase.database().ref('/trades').once('value').then(function(elems){
  elems.forEach(elem => elem.forEach(child=>child.key==key && vm.items.push(child.val())));
    });
});
vm.geoQuery.on("ready", function() {
  vm.geoQuery.cancel();
  console.log("ready");
});
  
});

  }
}
</script>

<style>
.ap-dropdown-menu{
  margin-top:0px !important;
  z-index: 1000 !important;
}
.leaflet-top{
  z-index:999  !important;
}
</style>
