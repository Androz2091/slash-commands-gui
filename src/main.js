import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import './assets/css/tooltip.css'
import router from './router'
import VTooltip from 'v-tooltip'

createApp(App)
    .use(router)
    .use(VTooltip)
    .mount('#app');
