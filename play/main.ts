import { createApp } from 'vue';
import App from './app.vue';
import Icon from '@chen-com/components/icon'
import '@chen-com/theme-chalk/src/index.scss'
import chenCom from '../packages/chen-com-ui/index'
const app = createApp(App)
// app.use(Icon)
app.use(chenCom)

app.mount('#app')