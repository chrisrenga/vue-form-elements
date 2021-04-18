const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: [
        './src/**/*.vue',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            maxWidth: {
                '3': '3em',
            },
            screens: {
                'print': {'raw': 'print'},
            },
            textOverflow: ['hover'],
        },
    },

    variants: {
        extend: {
            opacity: ['disabled'],
            backgroundColor: ['odd', 'even'],
        },
    },

    plugins: [
        require('@tailwindcss/ui'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};