import { getAliases } from 'vite-aliases'

const aliases = getAliases();

export default {
    base: '/slash-commands-gui',
    build: {
        assetsDir: 'assets'
    },
    alias: aliases
};
