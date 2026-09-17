/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        canvas: {
          light: '#F7F7FB',
          dark: '#0D0F1A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#131625',
        },
        border: {
          light: '#E7E6F2',
          dark: '#242840',
        },
        ink: {
          light: '#14152B',
          dark: '#EDEDF7',
        },
        muted: {
          light: '#6C6C86',
          dark: '#9797B5',
        },
        primary: {
          50: '#F1EFFE',
          100: '#E3DFFD',
          200: '#C6BEFB',
          300: '#A99EF8',
          400: '#8D7DF5',
          500: '#6E5BF0',
          600: '#5A45E0',
          700: '#4735B8',
          800: '#362A8C',
          900: '#261E63',
        },
        ai: {
          light: '#8B7CF6',
          dark: '#A599FA',
        },
        success: {
          50: '#E9F8F1',
          500: '#189C6E',
          600: '#128058',
        },
        warning: {
          50: '#FDF3E6',
          500: '#D98A2B',
          600: '#B96F1B',
        },
        danger: {
          50: '#FBEAEB',
          500: '#D8555C',
          600: '#B93F46',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 21, 43, 0.04), 0 4px 16px rgba(20, 21, 43, 0.04)',
        'card-dark': '0 1px 2px rgba(0, 0, 0, 0.2), 0 4px 20px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
