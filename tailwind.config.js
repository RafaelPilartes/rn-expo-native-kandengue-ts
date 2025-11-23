/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        baseText: '#022147',
        baseDark: '#000F21',
        baseTextWhite: '#ffffff',
        baseTextGray: 'rgb(209 213 219)',

        baseTxtLight: '#FFFFFF',
        baseTxtDark: '#111827',
        baseBgLight: '#F1F5F9',
        baseBgDark: '#1A222C',
        light: '#FFFFFF',
        dark: '#24303F',

        primary: {
          50: '#fadee0',
          100: '#f5babe',
          200: '#e0212d',
          300: '#ca1e29',
          400: '#b31a24',
          500: '#a81922',
          600: '#86141b',
          700: '#650f14',
          800: '#4e0c10',
          900: '#35070A'
        },
        accent: '#F13024'
      },

      padding: {
        containerXY: '24px',
        container: '24px 24px',
        'container-sm': '10px',
        'container-md': '15px',
        'container-lg': '25px'
      },

      boxShadow: {
        '3xl': '0 10px 40px -15px rgba(0, 0, 0, 0.1)',
        '4xl': '0 10px 40px -15px rgba(0, 0, 0, 0.2)'
      },
      backgroundImage: {
        // login: 'url("/background/login-bg.jpg")',
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite'
      }
    }
  },
  darkMode: 'class',
  plugins: [],
  presets: [require('nativewind/preset')]
}
