import { createRouter } from "vue-router"
//引入路由器模式
import { createWebHistory } from "vue-router";

import store from '@/store'
//引入在axios暴露出的clearPending函数
import { clearPending } from "@/request/axios.ts"

//创建路由器
const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    // 先写
    history:createWebHistory(),

    //管理路由
    routes:[  //一个一个的路由规则
        {
            name: 'login',
            //路径
            path: '/login',
            // @ts-ignore
            component: () => import('@/views/login/Login.vue'),
        },
        {
            name: 'home',
            //路径
            path: '/',
            meta: {
                // requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/Home.vue'),
            //子路由路径以/开头代表全路径配置，需要包含父路由路径,如path:'/parent/child'
            // 子路由可省略/开头，自动继承父路由路径，如path:'child'
        },
        {
            name: 'incomeItem',
            //路径
            path: '/incomeItem',   // 子级路由前不需要加 /
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/income1/IncomeItem.vue')
        },
        {
            name: 'incomeArea',
            //路径
            path: '/incomeArea',   // 子级路由前不需要加 /
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/income1/incomeArea.vue')
        },
        {
            name: 'riskItem',
            //路径
            path: '/riskItem',   // 子级路由前不需要加 /
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/risk1/RiskItem.vue')
        },
        {
            name: 'riskArea',
            //路径
            path: '/riskArea',   // 子级路由前不需要加 /
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/risk1/RiskArea.vue')
        },
    ]
})

//to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
//
// next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。
// next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
// next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
// @ts-ignore
router.beforeEach((to, from, next) => {
    //在跳转路由之前，先清除所有的请求
    clearPending()
    console.log('前置守卫')
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        // 校验时间
        // @ts-ignore  大于就过期
        // if (store.state.token && (Date.now() - state.state.startTime > 10 * 1000)) {  // 通过vuex state获取当前的token是否存在
        if (store.state.token) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})

export default router

