<template>
  <div id="app" class="landing">

    <MapView v-bind:items="filteredItems"></MapView>

    <div class="jumbotron">
      <div class="container">
        <ItemSearch  v-bind:searchFilter="filterKeywords.searchFilter" v-bind:offeringsFilter="filterKeywords.offeringsFilter" v-on:filterBySearch="filterBySearch" v-on:filterByOffer="filterByOffer" />
      </div>
    </div>

    <div class="container">
      <ItemList v-bind:items="filteredItems" v-on:contactUser="contactUser" />
    </div>

    <div v-bind:id="contactUserId" class="modal fade" tabindex="-1" role="dialog">
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
      message:""
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
console.log(this.selectedUser);
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
              axios.post("http://localhost:5000/api/conversations", conversation).then(function(res){
                   let msg={
              message: vm.message,
              from: user.uid,
              to: conversation.tradeWith,
              convId: conversation.convId,
              dateSent:Date.now()
            }
            console.log(msg);
            axios.post("http://localhost:5000/api/chat", msg).then((response)=>{}).catch((error)=>console.log(error));
            
            });
            }
        }); 
    },
    contactUser: function(user) {
      this.selectedUser = user;
      this.message="Hallo, ich würde gerne "+ this.selectedUser.tradeFor+" gegen "+ this.selectedUser.offer+" tauschen. Wollen wir dazu einen Treffpunkt vereinbaren?";
      $(".modal").modal();
      $("#modal-text").focus();
      console.log("Set user id to " + user._id);
    },
    sendMessage: function() {
      if (!this.contactUser) {
        console.error("Missing user id");
        return;
      }
    },

    filterBySearch: function(keyword) {
      this.filter_search_by = keyword;
    },

    filterByOffer: function(keyword) {
      this.filter_offer_by = keyword;
    },

    getUserLocation: function(callback) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          callback({
            long: pos.coords.longitude.toFixed(2),
            lat: pos.coords.longitude.toFixed(2)
          });
        });
      }
      else {
        var postal_code = prompt("Wir benötigen Deine ungefähre Position, um Angebote in Deiner Nähe zu finden. Bitte gib Deine PLZ an:");
        callback(postal_code);
      }
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
      var serverURL = "http://localhost:5000/api/search?topLeftLocation=52.40,13.40&lowerRightLocation=52.43,13.43";
      $.getJSON(serverURL).done(function(data) {
        console.log("Fetched item data");
        console.log(data);
        vm.items = data;
      }).fail(function(err) {
        console.log(err);
      });
    }
  },
  created: function() {
    var vm = this;
    console.log("Retrieve user location...");
    this.getUserLocation(function(location) {
      vm.user_location = location;
      var rectangle = vm.getPerimeterRectangle(location);
      vm.fetchItemList(rectangle);
    })
  }
}
</script>

<style>

</style>
