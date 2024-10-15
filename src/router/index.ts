import { createRouter } from "vue-router"
//引入路由器模式
import { createWebHistory } from "vue-router";

//创建路由器
const router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    // 先写
    history:createWebHistory(),

    //管理路由
    routes:[  //一个一个的路由规则
        {
            name: 'home',
            //路径
            path: '/',
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
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/income1/IncomeItem.vue')
        },
        {
            name: 'incomeArea',
            //路径
            path: '/incomeArea',   // 子级路由前不需要加 /
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/income1/incomeArea.vue')
        },
        {
            name: 'riskItem',
            //路径
            path: '/riskItem',   // 子级路由前不需要加 /
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/risk1/RiskItem.vue')
        },
        {
            name: 'riskArea',
            //路径
            path: '/riskArea',   // 子级路由前不需要加 /
            //组件绑定
            // @ts-ignore
            component: () => import('@/views/risk1/RiskArea.vue')
        },
    ]
})

export default router

