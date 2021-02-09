import { getAliases } from 'vite-aliases';
import vue from '@vitejs/plugin-vue';


const aliases = getAliases();

export default {
    aliases,
    plugins: [vue()]
};
