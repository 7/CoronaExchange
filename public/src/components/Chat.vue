<template>
  <div id="app" style="background-color:white;">
    <div v-for="message in messages" v-bind:key="message.id">
      <div v-if="message.id == 0" class="box1 sb1">{{ message.message }}</div>
      <div v-if="message.id == 1" class="box2 sb2">{{ message.message }}</div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "App",
  data() {
    return {
      messages: []
    };
  },
  mounted() {},
  methods: {
    setMessages: function(callback) {
      callback();
    },
    fetchItemList: function() {
      console.log("Fetch item list...");
      var vm = this;
      var url = "http://localhost:5000/api/chat/KhxRmzKFILT8ziEwDhPJZd65lnq1";
      $.getJSON(url)
        .done(function(data) {
          console.log("Fetched item data");
          console.log(data);
          data.forEach(m =>
            vm.messages.push({
              id: m.from == "KhxRmzKFILT8ziEwDhPJZd65lnq1" ? 1 : 0,
              message: m.text
            })
          );
        })
        .fail(function(err) {
          console.log(err);
        });
      console.log(this.messages);
    }
  },
  created: function() {
    var vm = this;
    console.log("Retrieve user location...");
    this.setMessages(function() {
      vm.fetchItemList();
    });
  }
};
</script>

<style>
.box1 {
  width: 60vw;
  margin: 25px auto;
  background: #668659;
  padding: 5px;
  text-align: center;
  font-weight: 500;
  color: #fff;
  font-family: arial;
  position: relative;
}
.box2 {
  width: 60vw;
  margin: 25px auto;
  background: #b8bfbb;
  padding: 5px;
  text-align: center;
  font-weight: 500;
  color: #fff;
  font-family: arial;
  position: relative;
}
.sb1:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid #668659;
  border-right: 10px solid transparent;
  border-top: 10px solid #668659;
  border-bottom: 10px solid transparent;
  right: -20px;
  top: 6px;
}
.sb2:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid transparent;
  border-right: 10px solid #b8bfbb;
  border-top: 10px solid #b8bfbb;
  border-bottom: 10px solid transparent;
  left: -19px;
  top: 6px;
}
</style>
