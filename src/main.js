import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { FontAwesomeIcon } from "./plugins/font-awesome"

createApp(App)
    .use(router)
    .component("fa", FontAwesomeIcon)
    .mount('#app');
