import './assets/main.css'
import 'flatpickr/dist/flatpickr.css'
import 'v-calendar/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// import '@fullcalendar/daygrid/main.global.css'
// import '@fullcalendar/daygrid/main.css'
// 컴포넌트 자동 등록
import * as components from './components'

// v-calendar 컴포넌트 import
import { Calendar, DatePicker } from 'v-calendar'

const app = createApp(App)
const pinia = createPinia()

// 전역 컴포넌트 등록
Object.entries(components).forEach(([name, component]) => {
  app.component(name, component)
})

// v-calendar 전역 등록 (이 부분이 중요!)
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)

app.use(router)
app.use(pinia)

app.mount('#app')
