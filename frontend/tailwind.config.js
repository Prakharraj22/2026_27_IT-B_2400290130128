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
        // Warm stone neutrals instead of cold blue-gray slate — reads less
        // like a generic "AI dashboard" and more like a considered, human
        // product.
        canvas: {
          light: '#FAFAF9',
          dark: '#1C1917',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#292524',
        },
        border: {
          light: '#E7E5E4',
          dark: '#44403C',
        },
        ink: {
          light: '#1C1917',
          dark: '#FAFAF9',
        },
        muted: {
          light: '#78716C',
          dark: '#A8A29E',
        },
        // Terracotta: warm, human, growth/achievement-coded — deliberately
        // not blue/indigo/violet/teal, which is what nearly every AI product
        // defaults to.
        primary: {
          50: '#FBF0EC',
          100: '#F5DBCF',
          200: '#E9B49B',
          300: '#DC8C68',
          400: '#CC6B41',
          500: '#B8532A',
          600: '#96421F',
          700: '#78341A',
          800: '#5E2A17',
          900: '#4A2213',
        },
        // A cool, deep teal as the AI-specific accent — a deliberate
        // complementary contrast to the warm terracotta primary, used only
        // for AI-badge/insight moments so it stays meaningful rather than
        // just another brand color.
        ai: {
          light: '#0E7C86',
          dark: '#5EEAD4',
        },
        success: {
          50: '#E9F8F1',
          500: '#189C6E',
          600: '#128058',
        },
        // Shifted toward gold/yellow (away from orange) so it stays visually
        // distinct from the new terracotta primary.
        warning: {
          50: '#FEF9E7',
          500: '#C99A0A',
          600: '#A67D08',
        },
        danger: {
          50: '#FBEAEB',
          500: '#D8555C',
          600: '#B93F46',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 25, 23, 0.05), 0 4px 16px rgba(28, 25, 23, 0.05)',
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
