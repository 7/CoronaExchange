<template>
  <div id="app" class="landing">
    
    <Navigation />

    <router-view></router-view>
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

</style>
