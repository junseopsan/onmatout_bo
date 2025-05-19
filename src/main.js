import './assets/main.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 컴포넌트 자동 등록
import * as components from './components'

const app = createApp(App)
const pinia = createPinia()

// 전역 컴포넌트 등록
Object.entries(components).forEach(([name, component]) => {
  app.component(name, component)
})

app.use(router)
app.use(pinia)

app.mount('#app')
