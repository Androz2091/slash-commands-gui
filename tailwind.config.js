const { colors: defaultColors } = require('tailwindcss/defaultTheme');

const colors = {
    ...defaultColors,
    ...{
        discord: '#7289DA',
        darkone: '#292b2f',
        darktwo: '#202225'
    }
};

module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors,
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: []
};
