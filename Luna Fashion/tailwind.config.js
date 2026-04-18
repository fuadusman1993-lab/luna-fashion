/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#f9e596',
          DEFAULT: '#d4af37', // metallic gold
          dark: '#aa8c2c',
        },
        luna: {
          black: '#0a0a0a',
          white: '#ffffff',
          gray: '#1a1a1a'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Montserrat"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
