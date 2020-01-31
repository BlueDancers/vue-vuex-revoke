import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app';
import history from './plugins/index';
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app
  },
  plugins: [history]
})
