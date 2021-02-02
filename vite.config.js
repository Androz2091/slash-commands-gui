import { getAliases } from 'vite-aliases'

const aliases = getAliases();

export default {
    base: '/slash-commands-gui',
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        }
    },
    alias: aliases
};
