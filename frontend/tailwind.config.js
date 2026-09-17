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
        // `primary` and `ai` are driven by CSS custom properties (defined
        // per color-theme in index.css, switched via [data-color-theme] on
        // <html> — see ColorThemeContext) rather than static hex values, so
        // the whole app can switch between 5 predefined color themes at
        // runtime without a rebuild. The "/<alpha-value>" suffix is
        // Tailwind's documented pattern for CSS-variable colors that still
        // support opacity modifiers (e.g. bg-primary-600/50).
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        },
        ai: {
          light: 'rgb(var(--color-ai-light) / <alpha-value>)',
          dark: 'rgb(var(--color-ai-dark) / <alpha-value>)',
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
