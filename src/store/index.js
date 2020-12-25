import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      envConfig: process.env.config,
      topicsList: null,
      topicDetail: null,
    },
    mutations,
    actions,
    getters,
  })
}
