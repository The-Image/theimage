const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  separator: '_',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        action: {
          DEFAULT: "#00ffff",
          hover: "#00ffff",
          focus: "#00ffff",
        },
        hubspot: {
          base: "#ff5c35"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
        system: [...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "xs": "0.875rem", // 14px
        "sm": "0.9375rem", // 15px
        "base": "1rem", // 16px
        "lg": "1.125rem", // 18px
        "xl": "1.3125rem", // 21px
        "2xl": "1.5rem", // 24px
        "3xl": "1.75rem", // 28px
        "4xl": "2rem", // 32px
        "5xl": "2.625rem" // 42px
        
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
