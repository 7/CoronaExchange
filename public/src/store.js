import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
      participant:null, // The TV inventory
      user:null,
      me:null,
      conversations:null,
      messages:null,
    },
    
    getters: {
      // Here we will create a getter
    },
    
    mutations: {
        SET_USER(state, user){
            state.user=user;
            state.me=user.uid;
        },
        SET_PARTICIPANT(state, participant){
            state.participant=participant;
        },
        SET_CONVERSATIONS(state, conversations){
            state.conversations=conversations;
        },
        SET_MESSAGES(state, messages){
            state.messages=messages;
        },

    },
    
    actions: {
      // Here we will create Larry
    }
  });