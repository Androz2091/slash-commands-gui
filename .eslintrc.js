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
        'vue/html-indent': ['error', 4]
    }
};
