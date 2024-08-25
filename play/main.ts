import { createApp } from 'vue';
import App from './app.vue';
import Icon from '@chen-com/components/icon'
const app = createApp(App)
app.use(Icon)
app.mount('#app')