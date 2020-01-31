// import { Store } from 'vuex';
// import { cloneDeep } from 'lodash';
// import History from './history';

// let history = new History()
// /**
//  *  监听vuex的行为
//  * @param store vuex实例
//  */
// export default function index(store: Store<any>) {
//   history.init(store);
//   store.subscribe((mutation, state) => {
//     history.setState(cloneDeep(state))
//   })
// }

// export function cancelHistory() {
//   history.replaceState()
// }


import { cloneDeep } from 'lodash'
import undoRedoHistory from './history'
const undoRedoPlugin = (store: any) => {
  undoRedoHistory.init(store)
  let firstState = cloneDeep(store.state)
  undoRedoHistory.addState(firstState)
  store.subscribe((mutation: any, state: any) => {
    undoRedoHistory.addState(cloneDeep(state))
  })
}

export default undoRedoPlugin
