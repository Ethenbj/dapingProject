import { createApp } from 'vue'

// @ts-ignore
import * as DataV from '@dataview/datav-vue3';
import * as echarts from  'echarts';
// import router from './router/index.js'
import ElementPlus from 'element-plus'  // 引入Element Plus 所需
import 'element-plus/dist/index.css'  // 引入Element Plus 所需
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  // 引入Element Plus icon 所需

import './style.css'
// @ts-ignore
import App from './App.vue'

const app = createApp(App)

// 引入Element Plus icon 所需
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// @ts-ignore
app.use(DataV, { classNamePrefix: 'dv-'})
// setClassNamePrefix('dv-')
// @ts-ignore
app.use(echarts)
app.use(ElementPlus)
app.mount('#app')
