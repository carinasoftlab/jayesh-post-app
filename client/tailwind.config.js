/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fefae0',
        amber: '#dda15e',
        olive: '#bc6c25',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: [],
}


