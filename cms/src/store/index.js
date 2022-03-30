import Vue from "vue";
// import Vuex from "vuex"


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    username: ""
  },
  getters: {
 
  },
  mutations: {
    changeVal (state, {k, v}) {
      state[k] = v
    }
  }
})

export default store