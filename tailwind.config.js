/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./*.{html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        cgray: '#F8FAFC',
        cblue: '#8cadd1',
        cblack: "#9AA6B2",
        cbg: "#eaf1f8"
      },
    },
  },
  plugins: [],
}

