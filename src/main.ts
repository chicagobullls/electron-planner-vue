import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Стили
import './styles/main.scss'

// SVG спрайты
import 'virtual:svg-icons-register'

// Глобальные компоненты
import Icon from './components/Icon.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Регистрируем глобальный компонент Icon
app.component('Icon', Icon)

app.mount('#app')
