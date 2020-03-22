<template>
  <div id="app" style="background-color:white;">
      <div v-for="message in messages" v-bind:key="message.id">
        <div v-if="message.id==0" class="box1 sb1">{{message.message}}</div>
        <div v-if="message.id==1" class="box2 sb2">{{message.message}}</div>
    </div>
    
    
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
      return{
          messages: [
              {message: "Hey, ich hätte 2 Packungen Nudeln. Tauschst du gegen dein Klopapier?", id:0},
              {message: "Klar, wie tauschen wir?", id:1},
              {message: "Ich könnte es dir heute um 14 Uhr vor die Tür legen, wenn du das Klopapier rauslegst nehme ich es dann mit", id:0},
              {message: "Ja passt für mich.", id:1},
              {message: "Ich wohne in der Prototypstraße 13, gelbes Haus", id:1},
              {message: "Super! Ich schreib dir wenn ich da bin!", id:0},
          ]
      }
  },
  
  mounted(){
   
  }
}
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
  position:relative;
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
  position:relative;
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
