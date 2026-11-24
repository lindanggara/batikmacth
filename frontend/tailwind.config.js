/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        batik: {
          50:  '#fdf6ec', 100: '#faecd4', 200: '#f3d5a6', 300: '#e9b66f',
          400: '#de9440', 500: '#c97a25', 600: '#a75f1c', 700: '#7e461a',
          800: '#5a331a', 900: '#3b2214',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
