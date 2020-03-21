<template>
<div id="app" class="landing">
    <div class="jumbotron">
      <div class="container">
        <ItemSearch />
      </div>
    </div>

    <div class="container">
      
     <ItemList v-bind:items="items" v-on:contactUser="contactUser" />
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
            <textarea name="" id="modal-text" class="form-control" rows="4">Hallo John Doe, ich würde gerne Nudeln gegen Toilettenpapier tauschen. Wollen wir dazu einen Treffpunkt vereinbaren?</textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Abbrechen</button>
            <button type="button" class="btn btn-primary">Nachricht senden</button>
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