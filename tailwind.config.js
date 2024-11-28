/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'wave': 'dreamWave 20s ease-in-out infinite',
        'wave-slow': 'dreamWave 30s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        dreamWave: {
          '0%, 100%': { 
            transform: 'translateX(-25%) translateY(5%) rotate(-2deg) scale(1.1)',
            opacity: '0.3'
          },
          '50%': { 
            transform: 'translateX(25%) translateY(-5%) rotate(2deg) scale(1)',
            opacity: '0.5'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      fontFamily: {
        'sans': ['"Zen Maru Gothic"', 'Hiragino Maru Gothic ProN', 'sans-serif'],
      },
      letterSpacing: {
        'comfort': '0.15em',
        'wide': '0.2em',
      },
      colors: {
        'text-primary': '#2c3e50',
        'text-secondary': 'rgba(52, 73, 94, 0.7)',
        'text-accent': '#3498db',
      }
    },
  },
  plugins: [],
}
