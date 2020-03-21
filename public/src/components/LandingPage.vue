<template>
  <div id="app" class="landing">

    <div class="jumbotron">
      <div class="container">
        <ItemSearch v-on:filterBySearch="filterBySearch" v-on:filterByOffer="filterByOffer" />
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
            <textarea name="" id="modal-text" class="form-control" rows="4">Hallo {{ contactUserId }}, ich würde gerne Nudeln gegen Toilettenpapier tauschen. Wollen wir dazu einen Treffpunkt vereinbaren?</textarea>
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
import { computeDestinationPoint } from "geolib"
import $ from "jquery"

export default {
  name: 'LandingPage',
  components: {
    Navigation,
    ItemSearch,
    ItemList
  },
  data: function() {
    return {
      contactUserId: null,
      user_location: null,
      perimeter_rectangle: null,
      filter_offer_by: "",
      filter_search_by: "",
      items: [
        {
            user: "Morpheus",
            location: {
                lat: 52.4923924,
                lng: 13.373914
            },
            offer: "Toilettenpapier",
            tradeFor: "Nudeln"
        },
        {
            user: "Wolverine",
            location: {
                lat: 52.5157723,
                lng: 13.3869281
            },
            offer: "Nudeln",
            tradeFor: "Toilettenpapier"
        },
        {
            user: "Gandalf",
            location: {
                lat: 52.5670062,
                lng: 13.3936488
            },
            offer: "Dosenwurst",
            tradeFor: "Mineralwasser"
        },
        {
            user: "Walter White",
            location: {
                lat: 52.4753942,
                lng: 13.3997043
            },
            offer: "Mineralwasser",
            tradeFor: "Dosenwurst"
        }
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
        latitude: location.lat - 5,
        longitude: location.long - 5
      }

      var bottomRightLocation = {
        latitude: Number(location.lat) + 5,
        longitude: Number(location.long) + 5
      };

      return {
        topLeftLocation: topLeftLocation,
        bottomRightLocation: bottomRightLocation
      };
    },

    fetchItemList: function(perimeter_rectangle) {
      console.log("Fetch item list...");
      // var url = `/api/search?topLeftLocation=${perimeter_rectangle.topLeftLocation.latitude},${perimeter_rectangle.topLeftLocation.longitude}&lowerRightLocation=${perimeter_rectangle.bottomRightLocation.latitude},${perimeter_rectangle.bottomRightLocation.longitude}`;
      var url = "/api/search?topLeftLocation=52,13&lowerRightLocation=54,14";
      $.get(url).done(function(data) {
        this.items = data;
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
