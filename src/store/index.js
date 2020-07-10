import Vue from 'vue'
import Vuex from 'vuex'
import RegisterVuex from './modules/RegisterVuex'
import LoginVuex from './modules/LoginVuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    RegisterVuex,
    LoginVuex
  }
})
