module.exports = {
    env: {
        browser: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        "plugin:vue/vue3-recommended"
    ],
    rules: {
        indent: ['error', 4],
        'vue/html-indent': ['error', 4],
        semi: ['error', 'always'],
        'quote-props': ['error', 'as-needed'],
        'max-len': 0,
        'vue/max-len': 0
    }
};
