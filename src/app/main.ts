import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './providers/router'
import { setupAuth } from './providers/auth'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/main.scss'

const app = createApp(App)

// Pinia має бути підключена до роутера, бо navigation guard використовує стор
app.use(createPinia())
setupAuth(router)
app.use(router)

app.mount('#app')
