<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light" style="background-color: #33443c !important;">
    <router-link :to="{path: '/'}">CoronaExchange</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <!-- <a class="nav-link" href="#">Produkte finden <span class="sr-only">(current)</span></a> -->
          <router-link :to="{path: '/'}" class="nav-link">Produkte finden</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{path: '/Chat'}" class="nav-link">Chats</router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Account</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" @click="modalToggle()">Register</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {

  methods: {
    modalToggle(){
      this.$modal.show();
    }  
  }
}
</script>
<style scoped>
.nav-link{
  color: white !important;
}
</style>