/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/*.{js,jsx,ts,tsx}", "./app/projects/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#51247a",
        secondary: "#682f9d",
        darkGrey: "#121212",
        lighterGrey: "#1F1F1F",
      },
    },
  },
  plugins: [],
};
