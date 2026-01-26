/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sofia Sans', 'Jost', 'sans-serif'],
        jost: ['Jost', 'sans-serif'],
        sofia: ['Sofia Sans', 'sans-serif'],
      },
      colors: {
        'cinema-dark': '#0B0F19',
        'cinema-card': '#111625',
        'cinema-light': '#F8FAFC',
        'cinema-card-light': '#FFFFFF',
      },
      letterSpacing: {
        'widest': '0.2em',
      }
    },
  },
  plugins: [],
}

