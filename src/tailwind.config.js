/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.js"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px) translateY(5px)' },
          '50%': { transform: 'translateX(5px) translateY(-5px)' },
          '75%': { transform: 'translateX(-5px) translateY(-5px)' },
        }
      },
      animation: {
        shake: 'shake 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.js"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px) translateY(5px)' },
          '50%': { transform: 'translateX(5px) translateY(-5px)' },
          '75%': { transform: 'translateX(-5px) translateY(-5px)' },
        }
      },
      animation: {
        shake: 'shake 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}