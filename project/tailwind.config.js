/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef6f0',
          100: '#d5ebda',
          200: '#acd7b7',
          300: '#7dbe91',
          400: '#4fa46c',
          500: '#2c6e3c',
          600: '#245c32',
          700: '#1c4927',
          800: '#14361d',
          900: '#0c2412',
        },
        beige: {
          50: '#fdfcf5',
          100: '#f8f6e9',
          200: '#ede9d0',
          300: '#e0d9b3',
          400: '#cec698',
          500: '#bdb07c',
        },
        gold: {
          50: '#fdf7ea',
          100: '#f9ecc8',
          200: '#f2d68e',
          300: '#e8be5c',
          400: '#d4a345',
          500: '#b8892e',
          600: '#9a6f1e',
          700: '#7c5614',
        },
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        arabic: ['"Scheherazade New"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
