import { createApp } from 'vue'
import store from './store';
import App from './App.vue'
import './index.css'
import './assets/css/tooltip.css'
import router from './router'
import VTooltip from 'v-tooltip'
import Toaster from "@meforma/vue-toaster";
import longClickDirective from './directives/longclick';

const longClickInstance = longClickDirective({ delay: 2000, interval: 0 })
console.log(longClickInstance);

createApp(App)
    .use(router)
    .use(VTooltip)
    .use(Toaster)
    .use(store)
    .directive('longclick', longClickInstance)
    .mount('#app');
