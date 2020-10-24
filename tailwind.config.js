// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
            height: {
                xs: "20rem",
                sm: "24rem",
                md: "28rem",
                lg: "32rem",
                xl: "36rem",
                '2xl': "38rem"
            },
            spacing: {
                '72': '18rem',
                '84': '21rem',
                '96': '24rem',
            },
            maxHeight: {
                24: "6rem",
                '2xl': "38rem"
            }
        },
    },
    plugins: [
        require('@tailwindcss/ui'),
    ]
}