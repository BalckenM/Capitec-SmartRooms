import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'animate.css'

// Import global styles
import './assets/css/main.css'
import './assets/css/responsive.css'
import './assets/css/global.css'
import './assets/css/admin-theme.css'
import './assets/css/components/_sidebar.css'
import './assets/css/components/_header.css'
import './assets/css/components/_loader.css'
import './assets/css/components/_enhanced-sidebar.css'

const app = createApp(App)

// Add error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Error info:', info)
}

// Add warning handler
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Warning:', msg)
  console.warn('Trace:', trace)
}

// Add Font Smoothing
document.documentElement.style.setProperty('-webkit-font-smoothing', 'antialiased')
document.documentElement.style.setProperty('-moz-osx-font-smoothing', 'grayscale')

const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
