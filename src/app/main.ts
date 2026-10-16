import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './providers/router'
import { setupAuth } from './providers/auth'
import { registerServices } from './providers/services'
import { setupUi } from './providers/ui'
import 'primeicons/primeicons.css'
import './styles/main.scss'

const app = createApp(App)

// Сервіси (репозиторії) реєструються до першого звернення до сторів
registerServices()

// Pinia має бути підключена до роутера, бо navigation guard використовує стор
app.use(createPinia())
setupAuth(router)
setupUi(app)
app.use(router)

app.mount('#app')
