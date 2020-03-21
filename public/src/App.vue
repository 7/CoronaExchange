<template>
  <div id="app" class="landing">
    <Navigation />
<router-view></router-view>
    <!--  -->
    
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue"
import ItemSearch from "./components/ItemSearch"
import ItemList from "./components/ItemList"
import $ from "jquery"
// import Chat from "./components/Chat"

export default {
  name: 'App',
  components: {
    Navigation,
    ItemSearch,
    ItemList,
    // Chat
  },
  data: function() {
    return {
      contactUserId: null,
      filter_offer_by: "",
      filter_search_by: "",
      items: [
        {
          user_id: "1",
          search: "Nudeln",
          offer: "Toilettenpapier",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "2",
          search: "Nudeln",
          offer: "Toilettenpapier",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "3",
          search: "Nudeln",
          offer: "Toilettenpapier",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "4",
          search: "Nudeln",
          offer: "Toilettenpapier",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "5",
          search: "Nudeln",
          offer: "Toilettenpapier",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "6",
          search: "Nudeln",
          offer: "Toilettenpapier",
          location: {
            long: "",
            lat: ""
          }
        },
      ]
    }
  },
  methods: {
    contactUser: function(userId) {
      this.contactUserId = userId;
      $(".modal").modal();
      $("#modal-text").focus();
      console.log("Set user id to " + userId);
    },

    sendMessage: function() {
      if (!this.contactUser) {
        console.error("Missing user id");
        return;
      }

      // $.get("/api/postMessage")...
    },

    getUserLocation: function(callback) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(pos) {
          callback({
            long: pos.coords.longitude,
            lat: pos.coords.longitude
          });
        });
      }
      else {
        var postal_code = prompt("Wir benötigen Deine ungefähre Position, um Angebote in Deiner Nähe zu finden. Bitte gib Deine PLZ an:");
        callback(postal_code);
      }
    }
  },
  created: function() {
    this.getUserLocation(function(location) {
      console.log(location);
    })
  }
}
</script>

<style>

</style>
