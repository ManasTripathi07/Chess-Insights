/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',          // include index.html
    './src/**/*.{js,jsx,ts,tsx}', // all files in src folder
  ],
  theme: {
    extend: {
      // Extend theme colors, fonts etc if needed here
    },
  },
  plugins: [],
}
