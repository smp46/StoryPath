/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        uqPurple: '#51247a',
        darkGrey: '#121212',
        lighterGrey: '#1F1F1F',
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '100%',
        md: '90%',
        lg: '85%',
        xl: '80%',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],

  darkMode: 'selector',
};
