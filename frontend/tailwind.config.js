/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores Wayuu personalizados
        wayuu: {
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          amber: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          yellow: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
          sand: {
            50: '#fefaf0',
            100: '#fef2d6',
            200: '#fce4ad',
            300: '#f9d174',
            400: '#f6be4a',
            500: '#f0a020',
            600: '#e4851b',
            700: '#bd6918',
            800: '#9a5419',
            900: '#7d4518',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'wayuu': '0 4px 14px 0 rgba(249, 115, 22, 0.15)',
        'wayuu-lg': '0 10px 25px -3px rgba(249, 115, 22, 0.2), 0 4px 6px -2px rgba(249, 115, 22, 0.1)',
        'wayuu-xl': '0 20px 25px -5px rgba(249, 115, 22, 0.25), 0 10px 10px -5px rgba(249, 115, 22, 0.1)',
        'wayuu-2xl': '0 25px 50px -12px rgba(249, 115, 22, 0.3)',
        'wayuu-inner': 'inset 0 2px 4px 0 rgba(249, 115, 22, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-wayuu': '0 8px 32px 0 rgba(249, 115, 22, 0.15)',
      },
      dropShadow: {
        'wayuu': '0 4px 8px rgba(249, 115, 22, 0.15)',
        'wayuu-lg': '0 10px 16px rgba(249, 115, 22, 0.2)',
      },
      gradientColorStops: {
        'wayuu-primary': '#f97316',
        'wayuu-secondary': '#fbbf24',
        'wayuu-accent': '#eab308',
      },
      backgroundImage: {
        'wayuu-gradient': 'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)',
        'wayuu-gradient-warm': 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #eab308 100%)',
        'wayuu-gradient-bg': 'linear-gradient(135deg, #fef9c3 0%, #fed7aa 50%, #fde68a 100%)',
        'wayuu-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E\")",
        'cultural-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-warm': 'pulse-warm 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-warm': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          from: { 
            opacity: '0',
            transform: 'translateX(20px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        bounceGentle: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      zIndex: {
        '100': '100',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      blur: {
        xs: '2px',
        '3xl': '64px',
      },
      brightness: {
        25: '.25',
        175: '1.75',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
        '15': '15deg',
      },
      skew: {
        '1': '1deg',
        '2': '2deg',
        '3': '3deg',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    // Plugin para añadir utilidades personalizadas
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.perspective': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-thin': {
          /* Firefox */
          'scrollbar-width': 'thin',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.gray.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.wayuu.orange.400'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme('colors.wayuu.orange.500'),
          },
        },
      }

      const newComponents = {
        '.btn-wayuu': {
          '@apply px-6 py-3 font-semibold rounded-lg shadow-lg transform transition-all duration-200': {},
          '@apply bg-gradient-to-r from-wayuu-orange-500 to-wayuu-yellow-500 text-white': {},
          '@apply hover:from-wayuu-orange-600 hover:to-wayuu-yellow-600 hover:shadow-xl hover:scale-105': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-wayuu-orange-400 focus:ring-offset-2': {},
          '@apply disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none': {},
        },
        '.btn-wayuu-outline': {
          '@apply px-6 py-3 font-semibold rounded-lg shadow-lg transform transition-all duration-200': {},
          '@apply bg-white border-2 border-wayuu-orange-300 text-wayuu-orange-600': {},
          '@apply hover:bg-wayuu-orange-50 hover:border-wayuu-orange-400 hover:shadow-xl hover:scale-105': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-wayuu-orange-400 focus:ring-offset-2': {},
        },
        '.card-wayuu': {
          '@apply bg-white rounded-2xl shadow-xl p-6 border border-wayuu-orange-100': {},
          '@apply transform transition-all duration-300': {},
          '@apply hover:shadow-2xl hover:scale-105 hover:border-wayuu-orange-200': {},
        },
        '.input-wayuu': {
          '@apply w-full px-4 py-3 border border-gray-300 rounded-lg': {},
          '@apply focus:ring-2 focus:ring-wayuu-orange-500 focus:border-transparent': {},
          '@apply transition-all duration-200 bg-white/80 backdrop-blur-sm': {},
          '@apply placeholder-gray-400': {},
          '&:focus': {
            '@apply shadow-lg shadow-wayuu-orange-200/50': {},
          },
        },
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.glass-wayuu': {
          backgroundColor: 'rgba(249, 115, 22, 0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(249, 115, 22, 0.2)',
        },
      }

      addUtilities(newUtilities)
      addComponents(newComponents)
    },
  ],
}