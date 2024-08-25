import { createApp } from 'vue';
import App from './app.vue';
import Icon from '@chen-com/components/icon'
import '@chen-com/theme-chalk/src/index.scss'

const app = createApp(App)
app.use(Icon)
app.mount('#app')