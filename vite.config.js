import { getAliases } from 'vite-aliases'

const aliases = getAliases();

export default {
    base: '/slash-commands-gui',
    alias: aliases
};
