import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupAuth } from './app/setup-auth'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.scss'

const app = createApp(App)

// Pinia має бути підключена до роутера, бо navigation guard використовує стор
app.use(createPinia())
setupAuth(router)
app.use(router)

app.mount('#app')
