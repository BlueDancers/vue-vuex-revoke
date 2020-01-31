import { Module } from 'vuex';

const app: Module<any, any> = {
  state: {
    num: 1
  },
  mutations: {
    SET_NUM(state, num) {
      state.num = num
    }
  }
}

export default app