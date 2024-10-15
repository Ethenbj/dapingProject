// @ts-ignore
import { createStore } from 'vuex'

// State（单一状态树）：存储应用程序的状态数据，类似于组件中的data属性。但与组件的data不同，Vuex的状态是响应式的，当状态发生变化时，所有依赖该状态的组件都会自动更新。
// Getters（状态获取）：用于从状态中派生出新的数据，类似于Vue组件中的计算属性。Getters可以对状态进行一些计算或过滤，并将结果暴露给组件使用。
// Mutations（变更）：用于修改状态的唯一途径。Mutations是同步的操作，用于处理同步的状态变更。每个Mutation都有一个字符串类型的事件名称和一个回调函数，通过提交（commit）Mutation来触发状态的变更。
// Actions（动作：提交mutation，可以包含异步操作）：用于处理异步操作和复杂的业务逻辑。Actions可以包含任意异步操作，例如发送网络请求或执行定时任务，并通过提交Mutations来修改状态。Actions可以通过分发（dispatch）来触发。
// Modules（模块）：用于将大型的Vuex应用程序拆分为更小的模块，每个模块都有自己的状态、获取器、变更和动作。这样可以更好地组织代码，提高代码的可维护性和可扩展性。
const store = createStore({
    // @ts-ignore
    state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
        count: 0,
        id: 0,
        title: '',
        // 首页左上中心 charts 图状态
        home_left_top_state: '',
        home_left_button_state: '',
    },
    mutations: {
        // @ts-ignore Home
        set_home_left_top_state(state, payload) {
            state.home_left_top_state = payload.home_left_top_state
            sessionStorage.setItem('state', JSON.stringify(state))
        },
        // @ts-ignore Home
        set_home_left_button_state(state, payload) {
            state.home_left_button_state = payload.home_left_button_state
            sessionStorage.setItem('state', JSON.stringify(state))
        },

        // @ts-ignore
        increment(state) {
            state.count++
        },
        // @ts-ignore
        set_incomeItem(state, payload) {
            state.title = payload.title
            state.id = payload.id
            sessionStorage.setItem('state', JSON.stringify(state))
        },
        // @ts-ignore
        set_title(state, payload) {
            state.title = payload.title
            sessionStorage.setItem('state', JSON.stringify(state))
        }

    },
    actions: {
        // @ts-ignore
        incrementAsync(context) {
            setTimeout(() => {
                context.commit('increment')
                // context.commit('set_incomeItem')
            }, 1000)
        }
    }
})

export default store
