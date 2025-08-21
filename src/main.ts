import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vant UI库
import Vant from 'vant'
import 'vant/lib/index.css'

// 触摸模拟器（用于桌面调试）
import '@vant/touch-emulator'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)

app.mount('#app')