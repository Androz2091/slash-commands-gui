import { ViteAliases } from 'vite-aliases';
import vue from '@vitejs/plugin-vue';

const aliases = ViteAliases();

export default {
    aliases,
    plugins: [vue()]
};
