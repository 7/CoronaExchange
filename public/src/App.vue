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
      user_location: null,
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
          offer: "Atemschutzmasken",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "3",
          search: "Atemschutzmasken",
          offer: "Handschuhe",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "4",
          search: "Nudeln",
          offer: "Desinfektionsmittel",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "5",
          search: "Handschuhe",
          offer: "Nudeln",
          location: {
            long: "",
            lat: ""
          }
        },
        {
          user_id: "6",
          search: "Atemschutzmasken",
          offer: "Toilettenpapier",
          location: {
            long: "",
            lat: ""
          }
        },
      ]
    }
  },
  computed: {
    filteredItems: function() {
      var items = this.items;
      var vm = this;

      if (vm.filter_search_by !== "" && vm.filter_search_by !== "Alles") {
        console.log("Filter search by " + this.filter_search_by);
        items = items.filter(function(item) { return item.offer === vm.filter_search_by; });
        console.log(items);
      }

      if (vm.filter_offer_by !== "" && vm.filter_offer_by !== "Alles") {
        console.log("Filter offer by " + this.filter_offer_by);
        items = items.filter(function(item) { return item.search === vm.filter_offer_by; });
        console.log(items);
      }

      return items;
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
    var vm = this;
    this.getUserLocation(function(location) {
      vm.user_location = location;
    })
  }
}
</script>

<style>

</style>
