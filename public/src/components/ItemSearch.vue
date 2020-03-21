<template>
  <form>

    <div class="row align-items-end justify-content-md-center">

      <div class="col-12 col-md-5 col-lg-4 mb-4 mb-md-0 form-group">
        <label for="item-offer">Ich suche</label>
        <select class="form-control" id="item-search">
          <option>Nudeln</option>
          <option>Toilettenpapier</option>
          <option>Atemschutzmasken</option>
          <option>Handschuhe</option>
          <option>Desinfektionsmittel</option>
        </select>
      </div>

      <div class="col-12 col-md-5 col-lg-4 mb-4 mb-md-0 form-group">
        <label for="item-offer">Ich biete</label>
        <select class="form-control" id="item-offer">
          <option>Nudeln</option>
          <option>Toilettenpapier</option>
          <option>Atemschutzmasken</option>
          <option>Handschuhe</option>
          <option>Desinfektionsmittel</option>
        </select>
      </div>

      <!-- <div class="col-12 col-lg mb-4 mb-lg-0 form-group">
        <label for="postal-code">Meine PLZ</label>
        <input id="postal-code" class="form-control" type="text">
      </div> -->

      <div class="col-12 col-md-2 col-lg-2 mb-0 form-group">
        <button type="submit" class="btn btn-primary">Suchen</button>
      </div>

    </div>

    
  </form>
</template>

<script>

export default {
  name: "ItemSearch"
}

</script>