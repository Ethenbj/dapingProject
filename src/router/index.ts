import { createRouter } from "vue-router"
//引入路由器模式
import { createWebHistory } from "vue-router";

// @ts-ignore
import home from "@/views/Home.vue";
// @ts-ignore
import a from "@/views/a.vue";

//创建路由器
const router = createRouter({
    // 先写
    history:createWebHistory(),

    //管理路由
    routes:[  //一个一个的路由规则
        {
            //路径
            path:'/home',
            //组件绑定
            component:home,
            children: [ // 下级路由
                {
                    //路径
                    path:'a/detail/:id',   // 子级路由前不需要加 /
                    //组件绑定
                    component:a
                }
            ]
        },
        {
            //路径
            path:'/a',
            //组件绑定
            component:a
        },
    ]
})

export default router

