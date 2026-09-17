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
          light: '#F8FAFC',
          dark: '#0B1220',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
        },
        border: {
          light: '#E2E8F0',
          dark: '#1E293B',
        },
        ink: {
          light: '#0F172A',
          dark: '#F1F5F9',
        },
        muted: {
          light: '#64748B',
          dark: '#94A3B8',
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        ai: {
          light: '#0D9488',
          dark: '#2DD4BF',
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
