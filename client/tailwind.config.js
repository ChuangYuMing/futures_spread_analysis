/* eslint-disable import/no-extraneous-dependencies */
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    colors,
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    fontFamily: {
      body: 'Noto Sans TC, system-ui, -apple-system, Roboto, sans-serif'
    },
    extend: {}
  },
  variants: {},
  plugins: []
}
