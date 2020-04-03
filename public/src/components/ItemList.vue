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
            <tr v-for="(item, index) in items" v-bind:key="item._id">
              <!-- <th scope="col">{{ item.name }}</th> -->
              <td>{{ item.offer }}</td>
              <td>{{ item.tradeFor }}</td>
              <!-- <td>15 Km</td> -->
              <td>
                <button type="button" class="btn btn-warning" v-on:click="contactUser(item)">Kontaktieren</button>
              </td>
            </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: "ItemList",
  props: ["items"],
  methods:{
    contactUser(item){
      console.log(item);
    }
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