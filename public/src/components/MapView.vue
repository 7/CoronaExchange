<template>
    <div>
        <l-map class="map" ref="myMap" :center="center" :zoom="zoom">
            <l-tile-layer
                    :url="url"
            />
            <div v-for="item in mapItems" :key="item.name">
                <l-marker @click="logItem(item)" :lat-lng="item.latlng" :icon="item.userId == userId ? ownTrades:otherTrades">
                    <l-tooltip :options="{ permanent: true, interactive: true }">
                        <div>{{getItems(item)}}</div>
                    </l-tooltip>
                </l-marker>
                
            </div>
            <l-marker @click="centerOwn()" :lat-lng="currentLocation" :icon="posIcon">
                    <l-tooltip :options="{ permanent: true, interactive: true }">
                        <div>Du</div>
                    </l-tooltip>
                </l-marker>
        </l-map>
    </div>
</template>

<script>
  import L from 'leaflet';
  import {LMap, LTileLayer, LMarker, LTooltip} from 'vue2-leaflet';
  import store from '../store.js';
  export default {
    store,
    name: "MapView",
    props: ["items","location"],
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LTooltip
    },
    data() {
      return {
        zoom: 15,
        center: L.latLng(47.814193, 9.653198),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        currentLocation:L.latLng(47.814193, 9.653198),
        posIcon : new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        ownTrades : new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        otherTrades : new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        userId:null,

      }
    },
    computed: {
      mapItems() {
        return this.items.map(i => Object.assign({latlng: L.latLng(i.location.lat, i.location.lng)}, i))
      }
    },
    methods:{
      centerOwn(){
        this.zoom=17;
        this.center=this.currentLocation;
      },
      getItems(item){
        var tmp = this.mapItems.filter(elem=> elem.location == item.location);
        if(tmp.length <=1) return item.offer;
        return tmp.length+" Angebote";

      },
      logItem:function(item){
        if(item.userId != this.userId) this.$emit('contactUser', item);
        
      }
    },
    created(){
      var vm=this;
      this.$store.subscribe((mutation,state)=>{
        if(mutation.type==='SET_LOCATION'){
            vm.center=L.latLng(vm.$store.state.currentLocation.lat,(vm.$store.state.currentLocation.lng));
            this.currentLocation=L.latLng(vm.$store.state.currentLocation.lat,(vm.$store.state.currentLocation.lng));
            vm.zoom=15;
        }
      });
    },
    mounted(){
      if(this.$store.state.user != null) this.userId = this.$store.state.user.uid;
    }
  }
</script>

<style scoped>
    .map {
        height: 400px;
    }

</style>
