<template>
  <form>

    <div class="row align-items-end justify-content-md-center">

      <div class="col-12 col-md-5 col-lg-4 mb-4 mb-md-0 form-group">
        <label for="item-offer">Ich suche</label>
        <select class="form-control" v-on:change="$emit('filterBySearch', filter_by_search)" v-model="filter_by_search" id="item-search">
          <option value="Alles">Alles</option>
          <option v-for="(filter, index) in searchFilter" v-bind:key="filter" v-bind:value="filter">{{ filter }}</option>
        </select>
      </div>

      <div class="col-12 col-md-5 col-lg-4 mb-4 mb-md-0 form-group">
        <label for="item-offer">Ich biete</label>
        <select class="form-control" v-on:change="$emit('filterByOffer', filter_by_offer)" v-model="filter_by_offer" id="item-offer">
          <option value="Alles">Alles</option>
          <option v-for="(filter, index) in offeringsFilter" v-bind:key="filter" v-bind:value="filter">{{ filter }}</option>
        </select>
      </div>

      <div class="col-12 col-md-2 col-lg-2 mb-0 form-group">
        <button type="submit" class="btn btn-primary">Suchen</button>
      </div>

    </div>

    
  </form>
</template>

<script>

export default {
  name: "ItemSearch",
  props: ["searchFilter", "offeringsFilter"],
  data: function() {
    return {
      filter_by_search: "",
      filter_by_offer: ""
    }
  }
}

</script>