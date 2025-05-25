/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable dark mode support
  theme: {
    extend: {
       colors: {
                        primary: '#16a34a',
                        secondary: '#059669',
                        accent: '#0369a1'
                    }
    },
  },
  plugins: [],
}

