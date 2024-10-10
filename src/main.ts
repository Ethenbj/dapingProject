import { createApp } from 'vue'

// @ts-ignore
import * as DataV from '@dataview/datav-vue3';
import * as echarts from  'echarts';
// @ts-ignore
import router from './router'
import ElementPlus from 'element-plus'  // 引入Element Plus 所需
import 'element-plus/dist/index.css'  // 引入Element Plus 所需
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  // 引入Element Plus icon 所需
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './style.css'
// @ts-ignore
import App from './App.vue'

const app = createApp(App)

// 引入Element Plus icon 所需
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 引入 vuetify
const vuetify = createVuetify({
    components,
    directives,
})

// @ts-ignore
app.use(DataV, { classNamePrefix: 'dv-'})
// setClassNamePrefix('dv-')
// @ts-ignore
app.use(echarts)
app.use(ElementPlus)
app.use(vuetify)
app.use(router)
app.mount('#app')
