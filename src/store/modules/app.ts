import { Module } from 'vuex';

const app: Module<any, any> = {
  namespaced: true,
  state: {
    num: 1
  },
  mutations: {
    ADD_NUM(state) {
      state.num = state.num + 1
    },
    LESS_NUM(state) {
      state.num = state.num - 1
    },
    FASTADD_NUM(state) {
      state.num = state.num + 100
    },
    SET_NUM(state, num) {
      state.num = num
    }
  }
}

export default app