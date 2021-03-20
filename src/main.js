import { createApp } from 'vue';
import store from './store';
import App from './App.vue';
import './index.css';
import router from './router';
import Toaster from '@meforma/vue-toaster';
import disableMenu from './directives/disable-menu';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css';

createApp(App)
    .use(router)
    .use(Toaster)
    .use(PerfectScrollbar)
    .use(store)
    .directive('disablemenu', disableMenu)
    .mount('#app');
