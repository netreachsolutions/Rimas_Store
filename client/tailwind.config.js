/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        zoomIn: {
          '0%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        zoomIn: 'zoomIn 1s ease-out forwards',
      },
      colors: {
        // red: "#E31C23", // You can still override specific colors
        // gray: "#7A7773",
        // blue: "#0000FF",
        // purple: "#514574",
        // "black" : "#000",
        // "dark-black": "#010203", // Fixed the typo (double `#`)
      },
      fontFamily: {
        primary: ["Barlow Condensed", "sans-serif"],
        secondary: ["Arsenal", "serif"],
        text: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
