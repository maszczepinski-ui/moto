/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{ts,tsx}'],
  // Tryb ciemny włącza się automatycznie według ustawień telefonu/komputera
  darkMode: 'media',
  theme: {
    extend: {
      // Czcionka Inter – wgrana z paczki npm (bez pobierania z Google przy wejściu na stronę)
      fontFamily: {
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        // Kolor główny: stalowy niebieski
        steel: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d7ea',
          300: '#97badb',
          400: '#6a9cc9',
          500: '#336699',
          600: '#26517a',
          700: '#1c3d5c',
          800: '#16304a',
          900: '#0f2438'
        },
        // Kolor ostrzeżeń: rdza
        rust: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ea580c',
          600: '#c2410c',
          700: '#9a3412',
          800: '#7c2d12',
          900: '#431407'
        }
      }
    }
  },
  plugins: []
};
