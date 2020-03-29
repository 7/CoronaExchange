import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
      participant:null, // The TV inventory
      user:null
    },
    
    getters: {
      // Here we will create a getter
    },
    
    mutations: {
        SET_USER(state, user){
            state.user=user;
        },
        SET_PARTICIPANT(state, participant){
            state.participant=participant;
        }
    },
    
    actions: {
      // Here we will create Larry
    }
  });