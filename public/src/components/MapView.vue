<template>
    <div>
        <l-map class="map" ref="myMap" :center="center" :zoom="zoom">
            <l-tile-layer
                    :url="url"
            />
            <div v-for="item in mapItems">
                <l-marker :lat-lng="item.latlng">
                    <l-tooltip :options="{ permanent: true, interactive: true }">
<!--                        <p>User: {{item.user}}</p>-->
<!--                        <p>Gesuch: {{item.tradeFor}}</p>-->
                        <div>{{item.offer}}</div>
                    </l-tooltip>
                </l-marker>
            </div>
        </l-map>
    </div>
</template>

<script>
  import L from 'leaflet';
  import {LMap, LTileLayer, LMarker, LTooltip} from 'vue2-leaflet';

  export default {
    name: "MapView",
    props: ["items"],
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LTooltip
    },
    data() {
      return {
        zoom: 13,
        center: L.latLng(52.41349, 13.416722),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      }
    },
    computed: {
      mapItems() {
        return this.items.map(i => Object.assign({latlng: L.latLng(i.location.lat, i.location.lng)}, i))
      }
    },
  }
</script>

<style scoped>
    .map {
        height: 400px;
    }

</style>
