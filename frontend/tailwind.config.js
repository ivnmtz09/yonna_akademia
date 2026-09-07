/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#2D5A4C',
        'brand-orange': '#F27405',
        'brand-light-green': '#E8F3F0',
        'dark-bg': '#121214',
        'dark-surface': '#18181b',
        'dark-border': '#27272a',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.40)',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}