<template>
  <div>
    <div class="table-responsive">
      <table id="item-list" class="table">
        <thead>
          <tr>
            <!-- <th scope="col">#</th> -->
            <th scope="col">Bietet</th>
            <th scope="col">Sucht</th>
            <!-- <th scope="col">Entfernung zu Dir</th> -->
            <th scope="col">Kontakt</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" v-bind:key="item._id" :style="getStyle(item)">
              <!-- <th scope="col">{{ item.name }}</th> -->
              <td>{{ item.offer }}</td>
              <td>{{ item.tradeFor }}</td>
              <!-- <td>15 Km</td> -->
              <td>
                <button type="button" class="btn btn-warning" v-on:click="$emit('contactUser', item)" v-if="item.userId != userId">Kontaktieren</button>
                <p  v-if="item.userId == userId" style="margin-bottom:0;">Dein Angebot</p>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import store from '../store.js';
export default {
  store,
  name: "ItemList",
  props: ["items"],
  data(){
    return{
      userId:null
    }
  },
  methods:{
    getStyle(item){
      if(item.userId == this.userId) return "background-color:lightgray;"
    }
  },
  mounted(){
    this.userId=this.$store.state.user.uid;
  }
}

</script>
<style scoped>
.btn-warning {
  background-color: #668659 !important;
  border-color: #668659 !important;
}
.btn-warning:hover{
  background-color: #668659 !important;
  border-color: #668659 !important;
}
</style>