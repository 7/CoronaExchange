<template>
    <div>
        <l-map class="map" ref="myMap" :center="center" :zoom="zoom">
            <l-tile-layer
                    :url="url"
            />
            <div v-for="item in mapItems">
                <l-marker @click="logItem(item)" :lat-lng="item.latlng">
                    <l-tooltip :options="{ permanent: true, interactive: true }">
<!--                        <p>User: {{item.user}}</p>-->
<!--                        <p>Gesuch: {{item.tradeFor}}</p>-->
                        <div>{{getItems(item)}}</div>
                    </l-tooltip>
                </l-marker>
                
            </div>
            <l-marker @click="centerOwn()" :lat-lng="currentLocation" >
                    <l-tooltip :options="{ permanent: true, interactive: true }">
<!--                        <p>User: {{item.user}}</p>-->
<!--                        <p>Gesuch: {{item.tradeFor}}</p>-->
                        <div>Du</div>
                    </l-tooltip>
                </l-marker>
        </l-map>
    </div>
</template>

<script>
  import L from 'leaflet';
  import {LMap, LTileLayer, LMarker, LTooltip} from 'vue2-leaflet';

  export default {
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
        zoom: 12,
        center: L.latLng(52.41349, 13.416732),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        currentLocation:L.latLng(52.41349, 13.416732),
        
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
        var tmp = this.mapItems.filter(elem=> elem.latLng == item.latLng);
        if(tmp.length <=1) return item.offer;
        return tmp.length+" Tauschanfragen";

      },
      logItem(item){
        console.log(item);
      }
    },
    created(){
      var vm=this;
      this.$store.subscribe((mutation,state)=>{
        if(mutation.type==='SET_LOCATION'){
            vm.center=L.latLng(vm.$store.state.currentLocation.lat,(vm.$store.state.currentLocation.lng));
            this.currentLocation=L.latLng(vm.$store.state.currentLocation.lat,(vm.$store.state.currentLocation.lng));
            vm.zoom=17;
        }
      });
    },
    mounted(){
    }
  }
</script>

<style scoped>
    .map {
        height: 400px;
    }

</style>
