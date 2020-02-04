# 基于vuex实现 撤销 与 反撤销 的plugins

![](http://www.vkcyan.top/video.gif)



## 前言

​		最近疫情肆虐,相信大家和我一样在家呆着,躲过了病毒的攻势,家里也不可以闲,闭门修炼真技术,或者为疫情出自己的一份力

祝祖国顶住难关,万众一心,战胜病毒



核心功能案例已经部署到github[vue-vuex-revoke](https://github.com/vkcyan/vue-vuex-revoke)

欢迎体验~~



## 思路

> 每次保存state都需要进行深克隆 生成 State 具体请看vuex文档 [快照]([https://vuex.vuejs.org/zh/guide/plugins.html#%E7%94%9F%E6%88%90-state-%E5%BF%AB%E7%85%A7](https://vuex.vuejs.org/zh/guide/plugins.html#生成-state-快照))

- 使用**store.subscribe**来监听每次mutation的发生
- 使用`History`类来保存每次state的状态与store实例等等信息
- 使用**store.replaceState**来替换整个state,完成时光旅行
- 使用"指针"来实现撤销与反撤销的实现



### 注册插件

> Vuex 的 store 接受 `plugins` 选项，这个选项暴露出每次 mutation 的钩子。

新建`@/store/plugins/index.ts`

```javascript
/**
 *  监听vuex的行为
 * @param store vuex实例
 */
export default function index(store: Store<any>) {
  // 保存初始状态
  history.setState(cloneDeep(store.state))
  store.subscribe((mutation, state) => {
    console.log(mutation, state)
  })
}
```

`@/store/index.ts`

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app';
import history from './plugins/index';
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
  },
  plugins: [history]
})
```



现在我们操作vuex看看

![](http://www.vkcyan.top/158081534xadadewwada.png)

第一个参数是当前参数是对象mutations对象,包含当前执行的mutations以及传入的值

第二个参数为当前vuex的state

### 创建History类来保存快照

`@/store/plugins/history.ts`

init初始化的时候获取当前store对象以及最大存储快照数量

每次监听到mutations发生的时候都会进行快照存储,并且限制长度防止爆栈,以及对撤销后的快照处理

并且对每次mutations进行去抖控制,例如300ms类发生的多次vuex操作只记录最后一次



撤销函数 `replaceState` 每次撤销都将当前快照指针前移一位,获取前一位的快照,进行vuex的状态回溯

反撤销函数 `unReplaceState` 每次反撤销都将当前快照指针后移一位,获取后一位快照,进行vuex的状态回溯

在进行vuex的状态回溯的过程中都需要对当前指针位置进行判断,不可超出

```javascript
import { Store } from 'vuex';
import { cloneDeep } from 'lodash';
class History {
  private store: Store<any> | any = ''; // vuex实例
  private state: any[] = []; // 历史状态
  private index: number = 0; // 当前状态下标
  private maxState: number = 20 // 最大保存状态个数 (防止爆栈)
  public init(store: any, maxState: number) {
    this.store = store
    this.maxState = maxState
  }
  public setState(state: any) {
    debounce(() => {
      // 限制长度
      if (this.state.length >= this.maxState) {
        this.state.shift()
      }
      // 如果this.state.length 与this.index不一致说明,当前指针发生了变化,所以将指针后面的都去掉
      if (this.index < this.state.length - 1) {
        this.state.splice(this.index + 1, this.state.length - 1)
      }
      this.state.push(state)
      this.index = this.state.length - 1 // 方便下标的计算 都从0开始计算
    }, 100)
  }
  /**
   * 获取快照 用于调试
   */
  private getState() {
    return this.state
  }
  public replaceState() {
    // 撤销
    if (this.index > 0) {
      this.index--
      let state = cloneDeep(this.state[this.index])
      this.store.replaceState(state)
    } else {
      alert('已经无法再进行撤回')
    }
  }
  public unReplaceState() {
    if (this.state.length - 1 > this.index) {
      // 反撤销
      this.index++
      let state = cloneDeep(this.state[this.index])
      this.store.replaceState(state)
    } else {
      alert('已经无法再进行操作')
    }
  }
}

export default History;


let timeout: any = null;
/**
 * 去抖函数封装体
 * @param {Fun} fn 执行函数
 * @param {Number} wait 触发时间 
 */
export function debounce(fn: Function, wait: number) {
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(fn, wait);
}

```



### 使用History进行状态记录

plugins进行初始化的时候,将store实例以及最大存储快照数传递給class

并且保存初始vuex状态

最后在store.subscribe中每次监听都进行保存

> 对于不需要保存的判断mutation.type即可,跳过无需保存的mutation

````JavaScript
import { Store } from 'vuex';
import { cloneDeep } from 'lodash';
import History from './history';

let history = new History()

/**
 * 不需要记录的mutation
 */
const filterMutation: any[] = [
  'app/SET_NUM'
]
const maxState: number = 20
/**
 *  监听vuex的行为
 * @param store vuex实例
 */
export default function index(store: Store<any>) {
  // 保存vuex的实例
  history.init(store, maxState);
  // 保存初始状态
  history.setState(cloneDeep(store.state))
  store.subscribe((mutation, state) => {
    if (!filterMutation.includes(mutation.type)) {
      history.setState(cloneDeep(state))
    }
  })
}

/**
 * 撤销
 */
export function cancelHistory() {
  history.replaceState()
}

/**
 * 反撤销
 */
export function unCancelHistory() {
  history.unReplaceState()
}
````



到此处插件开发已经完成,如何使用它进行状态回溯呢?



### 使用

> 在任意地方导出撤销与反撤销方法即可
>
> 可参照[demo](https://github.com/vkcyan/vue-vuex-revoke/blob/master/src/components/HelloWorld.vue)

```
import { cancelHistory, unCancelHistory } from "@/store/plugins/index";
```



js版本[cancelPlugins](https://github.com/vkcyan/vue-vuex-revoke/tree/master/src/store/plugins/version_js/plugins/cancelPlugins)



欢迎加入交流群一起交流技术,解决问题~~~

![](http://www.vkcyan.top/20200204202404.png)







