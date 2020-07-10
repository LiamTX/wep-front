import axios from '../../util/axios'

export default {

  namespaced: true,

  state: {

  },

  getters: {


  },

  mutations: {

  },

  actions: {

    async register (context, newData) {

      const autho = await axios.post(process.env.VUE_APP_BASE_URL + '/user', newData)

      return autho.data

    }

  }
}
