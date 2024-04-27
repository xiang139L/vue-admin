import { createApp } from 'vue'
import App from './App.vue'

// import 'lib-flexible'
import './styles/normalize.css'
import router from './router/index.js'
import pinia from './store/index.js'
import './permission.js'

// UI框架 element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 注册icon组件
import * as ElIconsModules from '@element-plus/icons-vue'
import SvgIcon from './components/SvgIcon/index.vue' // svg component

const app = createApp(App)
app.component('svg-icon', SvgIcon)
// 全局注册element-plus icon图标组件
Object.keys(ElIconsModules).forEach((key) => {
  //循环遍历组件名称
  if ('Menu' !== key) {
    //如果不是图标组件不是Menu，就跳过，否则加上ICon的后缀
    app.component(key, ElIconsModules[key])
  } else {
    app.component(key + 'Icon', ElIconsModules[key])
  }
})

app.use(router).use(pinia).use(ElementPlus).mount('#app')
