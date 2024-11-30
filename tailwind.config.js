/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'ripple': 'ripple 16s cubic-bezier(0.1, 0.5, 0.3, 1) forwards',
        'bubble': 'bubble 20s ease-in-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { 
            transform: 'scale(0)',
            opacity: 1
          },
          '3%': {
            transform: 'scale(0.1)',
            opacity: 0.9
          },
          '20%': {
            opacity: 0.7
          },
          '50%': {
            opacity: 0.4
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: 0
          }
        },
        bubble: {
          '0%': { 
            transform: 'translateY(100vh) scale(0)',
            opacity: 0 
          },
          '20%': { 
            opacity: 0.8 
          },
          '80%': { 
            opacity: 0.8 
          },
          '100%': { 
            transform: 'translateY(-100vh) scale(1)',
            opacity: 0 
          }
        },
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
