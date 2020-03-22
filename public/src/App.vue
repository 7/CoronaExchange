<template>
  <div id="app" class="landing" style="min-height:100vh; background-color:#b8bfbb;">
    
    <Navigation class="frame" style="min-height:5vh"/>

    <router-view class="frame" style="min-height:95vh"></router-view>
    <login-modal/>
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue"

export default {
  name: 'App',
  components: {
    Navigation,
  },
  mounted(){
    this.$modal.show();
  }
}
</script>

<style>
.frame{
  max-width:1200px;
  margin:auto;
  background-color: white;
  
}
</style>
