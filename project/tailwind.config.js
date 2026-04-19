/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        arabic: ['"Noto Sans Arabic"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Vert Émeraude spirituel
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        accent: {
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
          950: '#451a03',
        },
        beige: {
          50: '#fdfbf7',
          100: '#f9f4e8',
          200: '#f1e6cf',
          300: '#e7d3aa',
          400: '#d8b97d',
          500: '#c79d57',
          600: '#b88a4a',
          700: '#9a6f3e',
          800: '#7d5a36',
          900: '#664a2f',
          950: '#362617',
        },
        gold: {
          50: '#fffdf0',
          100: '#fffacc',
          200: '#fff399',
          300: '#ffe666',
          400: '#ffd333',
          500: '#ffbf00', // Gold principal
          600: '#d19b00',
          700: '#a37900',
          800: '#755700',
          900: '#473500',
          950: '#291e00',
        },
        quran: {
          50: '#f0f9fa',
          100: '#d9f0f2',
          200: '#b7e1e5',
          300: '#86cbd1',
          400: '#4dade2',
          500: '#2ca4ab', // Teal de Quran.com
          600: '#24868c',
          700: '#206d73',
          800: '#1e595e',
          900: '#1d4b4f',
          950: '#0e2d31',
        },
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 18px -7px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 40px -5px rgba(0, 0, 0, 0.15), 0 8px 24px -7px rgba(0, 0, 0, 0.08)',
        'gold-glow': '0 0 20px -2px rgba(234, 179, 8, 0.2)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
